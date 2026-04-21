# Code-server — Environnement codelab multi-utilisateurs

VS Code dans le navigateur, un environnement isolé par participant, géré via Docker Compose + Traefik, exposé en HTTPS par le Caddy de la stack `shared-services-server/`.

## Architecture

```
Caddy (shared-services-server, TLS :443)
   │   *.code.lab.benvii.com
   ▼
Traefik (réseau lab_edge, pas de port host)
├── alice.code.lab.benvii.com   → conteneur code-alice  (1 GB RAM, 1 CPU)
├── bob.code.lab.benvii.com     → conteneur code-bob
└── ...                          → ...
```

Chaque participant accède à son instance via `https://<prenom>.code.lab.benvii.com`.  
Le dossier `codelab/` est monté en lecture seule chez tous — les exercices s'y déposent une fois.

> **Prérequis** : la stack `shared-services-server/` doit être démarrée en premier — elle crée le réseau Docker externe `lab_edge` et termine le TLS.

---

## Avant le codelab

### 1. Préparer la liste des participants

Éditer `users.txt` (une ligne par participant) :

```
# Format : prenom:motdepasse
alice:codelab2024
bob:codelab2024
charlie:codelab2024
```

> Mot de passe identique pour tous (pratique en codelab) ou individuel — les deux sont supportés.

### 2. Déposer les fichiers d'exercices

Copier les fichiers dans `codelab/` — ils seront montés en lecture seule dans le répertoire `/home/coder/codelab` de chaque participant :

```
codelab/
├── exercice-01/
├── exercice-02/
└── ...
```

### 3. Générer la configuration

```bash
./generate.sh
```

Crée `docker-compose.yml` et les dossiers `users/<prenom>/workspace/` pour chaque participant.

> À relancer à chaque modification de `users.txt`.

---

## Le jour du codelab

### 1. Démarrer la stack shared-services-server

Depuis le dossier parent (`shared-services-server/`) :

```bash
docker compose up -d
```

Ceci crée le réseau `lab_edge` et démarre Caddy (TLS sur `:443`).

### 2. Vérifier `.env` (déjà versionné par défaut : `DOMAIN=code.lab.benvii.com`)

```bash
cat .env
# DOMAIN=code.lab.benvii.com
```

### 3. (Re)générer et démarrer

```bash
./generate.sh
docker compose up -d
```

### 4. Vérifier que tout tourne

```bash
docker compose ps
```

Tous les conteneurs doivent être en état `Up`.

### 5. Communiquer les accès aux participants

| Participant | URL                                      | Mot de passe  |
|-------------|------------------------------------------|---------------|
| alice       | https://alice.code.lab.benvii.com        | codelab2024   |
| bob         | https://bob.code.lab.benvii.com          | codelab2024   |
| ...         | https://&lt;prenom&gt;.code.lab.benvii.com | ...           |

---

## Pendant le codelab

### Déposer un fichier sur tous les postes

Copier dans `codelab/` — visible immédiatement chez tous sans redémarrage :

```bash
cp mon-fichier.py codelab/
```

### Voir les logs d'un participant

```bash
docker compose logs -f code-alice
```

### Redémarrer l'instance d'un participant

```bash
docker compose restart code-alice
```

### Ajouter un participant en cours de route

1. Ajouter la ligne dans `users.txt`
2. `./generate.sh && docker compose up -d`

---

## Après le codelab

```bash
docker compose down
```

Les workspaces sont conservés dans `users/<prenom>/workspace/` pour récupération ultérieure.

Pour tout supprimer (conteneurs + données) :

```bash
docker compose down
rm -rf users/*/workspace/*
```

---

## Dimensionnement (MacBook Pro M4 — 42 Go RAM)

| Participants | RAM estimée | CPU (M4 10 cœurs) |
|:---:|:---:|:---:|
| 30 | ~15 Go | Confortable |
| 60 | ~30 Go | OK (charge séquentielle) |
| 60 actifs simultanément | ~30 Go | Acceptable |

Limites par conteneur configurées dans `generate.sh` : `512 MB RAM`, `1 CPU`.
