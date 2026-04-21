# Guide nmcli & iptables — Pi en routeur WISP (wlan1)

Guide pratique pour gérer les connexions Wi-Fi via `nmcli` et configurer le NAT
sur l'interface `wlan1`, dans le cadre d'un setup Raspberry Pi en amont d'un
routeur pour partager un Wi-Fi public.

## Sommaire

1. [Scan Wi-Fi sur une interface spécifique](#1-scan-wifi-sur-une-interface-spécifique)
2. [Up / Down d'une connexion](#2-up--down-dune-connexion)
3. [Créer une connexion Wi-Fi](#3-créer-une-connexion-wifi)
4. [NAT via iptables sur wlan1](#4-nat-via-iptables-sur-wlan1)
5. [Workflow type pour le codelab](#5-workflow-type-pour-le-codelab)

---

## 1. Scan Wi-Fi sur une interface spécifique

```bash
# Forcer un rescan puis lister (par défaut nmcli peut afficher un cache)
sudo nmcli device wifi rescan ifname wlan1
sudo nmcli device wifi list ifname wlan1

# Affichage détaillé (SSID + BSSID + signal + sécurité + canal)
sudo nmcli -f IN-USE,BSSID,SSID,SIGNAL,SECURITY,CHAN device wifi list ifname wlan1

# Vérifier l'état de l'interface
nmcli device status
nmcli device show wlan1
```

> ⚠️ Un SSID caché n'apparaîtra pas dans le scan — il faudra le créer
> manuellement (voir section 3).

---

## 2. Up / Down d'une connexion

`nmcli` distingue deux notions :

- **device** : l'interface physique (ex. `wlan1`)
- **connection** : le profil de config sauvegardé (identifié par nom ou UUID)

```bash
# Lister tous les profils de connexion
nmcli connection show

# Filtrer sur ceux actifs
nmcli connection show --active

# Activer un profil
sudo nmcli connection up "NomDuProfil"
sudo nmcli connection up "NomDuProfil" ifname wlan1   # forcer l'interface

# Désactiver un profil
sudo nmcli connection down "NomDuProfil"

# Déconnecter brutalement l'interface (sans toucher au profil)
sudo nmcli device disconnect wlan1

# Reconnecter l'interface sur son profil par défaut
sudo nmcli device connect wlan1
```

---

## 3. Créer une connexion Wi-Fi

### Cas A — Wi-Fi WPA/WPA2 PSK

**Méthode rapide** (one-shot, crée le profil + se connecte) :

```bash
sudo nmcli device wifi connect "MonSSID" password "MonMotDePasse" ifname wlan1
```

Le profil est créé automatiquement avec pour nom le SSID.

**Méthode explicite** (contrôle total) :

```bash
sudo nmcli connection add \
  type wifi \
  ifname wlan1 \
  con-name "palais-wifi" \
  ssid "SSID_Palais" \
  -- \
  wifi-sec.key-mgmt wpa-psk \
  wifi-sec.psk "MonMotDePasse"

sudo nmcli connection up "palais-wifi"
```

### Cas B — Wi-Fi ouvert (sans mot de passe)

```bash
# Méthode rapide
sudo nmcli device wifi connect "SSID_Ouvert" ifname wlan1

# Méthode explicite
sudo nmcli connection add \
  type wifi \
  ifname wlan1 \
  con-name "palais-open" \
  ssid "SSID_Ouvert"

sudo nmcli connection up "palais-open"
```

### Options utiles selon le contexte

```bash
# SSID caché
sudo nmcli connection modify "palais-wifi" 802-11-wireless.hidden yes

# Cloner un MAC (contournement portail captif)
sudo nmcli connection modify "palais-wifi" \
  802-11-wireless.cloned-mac-address AA:BB:CC:DD:EE:FF

# Utiliser le MAC permanent de la carte (désactive la randomisation)
sudo nmcli connection modify "palais-wifi" \
  802-11-wireless.cloned-mac-address permanent

# Priorité (plus haut = préféré si plusieurs profils matchent)
sudo nmcli connection modify "palais-wifi" connection.autoconnect-priority 10

# Désactiver l'autoconnect
sudo nmcli connection modify "palais-wifi" connection.autoconnect no

# Appliquer les modifications
sudo nmcli connection up "palais-wifi"
```

### Supprimer un profil

```bash
sudo nmcli connection delete "palais-wifi"
```

---

## 4. NAT via iptables sur wlan1

Objectif : tout ce qui entre par `eth0` ressort masqueradé via `wlan1`.

### Prérequis — IP forwarding

```bash
echo 'net.ipv4.ip_forward=1' | sudo tee /etc/sysctl.d/99-routing.conf
sudo sysctl -p /etc/sysctl.d/99-routing.conf

# Vérification (doit renvoyer 1)
cat /proc/sys/net/ipv4/ip_forward
```

### Règles NAT

```bash
# NAT sortant (masquerade) sur wlan1
sudo iptables -t nat -A POSTROUTING -o wlan1 -j MASQUERADE

# Forwarding eth0 -> wlan1 (trafic sortant des clients)
sudo iptables -A FORWARD -i eth0 -o wlan1 -j ACCEPT

# Forwarding wlan1 -> eth0 (réponses uniquement, stateful)
sudo iptables -A FORWARD -i wlan1 -o eth0 \
  -m conntrack --ctstate RELATED,ESTABLISHED -j ACCEPT
```

### Persistance au reboot

```bash
# Installer iptables-persistent si pas déjà fait
sudo apt install -y iptables-persistent

# Sauvegarder les règles actuelles
sudo netfilter-persistent save

# Recharger manuellement si besoin
sudo netfilter-persistent reload
```

Les règles sont stockées dans `/etc/iptables/rules.v4` et rejouées au boot.

### Vérifications

```bash
# Règles NAT
sudo iptables -t nat -L POSTROUTING -n -v

# Règles FORWARD
sudo iptables -L FORWARD -n -v

# Compteurs détaillés avec numéros de ligne
sudo iptables -t nat -L -n -v --line-numbers
```

### Supprimer une règle

```bash
# Par numéro de ligne
sudo iptables -t nat -L POSTROUTING -n --line-numbers
sudo iptables -t nat -D POSTROUTING 1

# Ou symétriquement à l'ajout (remplacer -A par -D)
sudo iptables -t nat -D POSTROUTING -o wlan1 -j MASQUERADE
```

### Nettoyage complet (reset)

```bash
# Flush toutes les règles
sudo iptables -F
sudo iptables -t nat -F
sudo iptables -X

# Sauvegarder l'état vide
sudo netfilter-persistent save
```

---

## 5. Workflow type pour le codelab

```bash
# 1. Scan des réseaux dispos
sudo nmcli device wifi rescan ifname wlan1
sudo nmcli device wifi list ifname wlan1

# 2. Connexion au Wi-Fi du Palais
sudo nmcli device wifi connect "WifiPalais" password "xxx" ifname wlan1

# 3. Vérifier la connectivité Internet
ping -c 3 1.1.1.1

# 4. Activer le NAT (une fois, puis persisté)
sudo iptables -t nat -A POSTROUTING -o wlan1 -j MASQUERADE
sudo iptables -A FORWARD -i eth0 -o wlan1 -j ACCEPT
sudo iptables -A FORWARD -i wlan1 -o eth0 \
  -m conntrack --ctstate RELATED,ESTABLISHED -j ACCEPT
sudo netfilter-persistent save

# 5. Vérifier que eth0 sert bien du DHCP (dnsmasq actif)
sudo systemctl status dnsmasq
sudo journalctl -u dnsmasq -f   # suivre les leases DHCP en temps réel
```

### En cas de portail captif

```bash
# 1. Se connecter au Wi-Fi depuis un laptop, valider le portail
# 2. Noter l'adresse MAC du laptop (ip link show / ifconfig)
# 3. Cloner ce MAC sur le Pi
sudo nmcli connection modify "WifiPalais" \
  802-11-wireless.cloned-mac-address XX:XX:XX:XX:XX:XX
sudo nmcli connection up "WifiPalais"
```
