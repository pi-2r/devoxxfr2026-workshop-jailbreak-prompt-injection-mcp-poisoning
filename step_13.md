
# Prise en main de l'environnement MCP Labs

[<img src="img/prepare_for_battle.png" alt="prepare for battle" width="800">](https://www.youtube.com/watch?v=gXC-jJhFABQ)

> *"I will not say: do not weep; for not all tears are an evil."* — Gandalf, LOTR - The Return of the King

## 🎯 Objectifs de cette étape

- Lancer votre environnement de travail (GitHub Codespaces ou local)
- Découvrir les 4 labs pratiques MCP disponibles
- Comprendre comment naviguer, lancer et modifier les labs

## Sommaire

- [I. Lancer votre environnement](#i-lancer-votre-environnement)
  - [Option A : GitHub Codespaces (Recommandé)](#option-a--depuis-github-codespaces-recommandé)
  - [Option B : En local](#option-b--en-local-alternative-si-problèmes-réseau)
- [II. Découverte des Labs](#ii-découverte-des-labs)
  - [Comment lancer un lab ?](#comment-lancer-un-lab-)
  - [Pour modifier le code](#pour-modifier-le-code)
- [Étape suivante](#étape-suivante)
- [Ressources](#ressources)

---

## I. Lancer votre environnement

**Vous n'avez besoin que d'un navigateur web.** Toutes les dépendances (Node.js, Docker, TypeScript) sont déjà préconfigurées.

### Option A : Depuis GitHub Codespaces (Recommandé)
1. Assurez-vous d'être connecté à votre compte GitHub.
2. Cliquez sur le bouton vert **"Code"** en haut à droite du dépôt.
3. Allez dans l'onglet **"Codespaces"**.
4. Cliquez sur **"Create codespace on main"**.
5. Patientez quelques minutes. Un éditeur VS Code complet s'ouvrira directement dans votre navigateur !

### Option B : En local (Alternative si problèmes réseau)
*Attention : Vous devez avoir Docker et VS Code installés avec l'extension "Dev Containers".*
1. Clonez ce dépôt sur votre machine : `git clone <URL_DU_DEPOT>`
2. Ouvrez le dossier dans VS Code.
3. Une notification apparaîtra en bas à droite proposant de rouvrir le dossier dans un conteneur (**Reopen in Container**). Cliquez dessus.

---

## II. Découverte des Labs

Une fois votre environnement lancé, vous trouverez 4 dossiers dans le répertoire `/mcp` :

- `mcp-command-injection`
- `mcp-poisoning`
- `mcp-rug-pull`
- `mcp-shadowing`

Chaque dossier contient son propre `TUTORIAL.md` ou un `README.md` spécifique au lab.

### Comment lancer un lab ?

1. Ouvrez un terminal intégré dans votre environnement web (Menu en haut à gauche : `Terminal -> New Terminal`).
2. Déplacez-vous dans le lab que vous souhaitez étudier. Exemple :
   ```bash
   cd mcp/mcp-poisoning
   ```
3. Lisez les instructions spécifiques au lab (dans le fichier `TUTORIAL.md`).
4. Généralement, vous pourrez lancer le lab via `docker compose up -d` ou via le `Makefile`. **Note :** Votre environnement a déjà Docker configuré, donc tout fonctionnera de manière transparente !

### Pour modifier le code
Vous pouvez éditer n'importe quel fichier métier ou configuration directement depuis l'éditeur de l'interface (TypeScript, Dockerfile...). N'hésitez pas à relancer les conteneurs du lab après chaque modification via `docker compose up -d --build`.

---

## Étape suivante

▶️ [Étape 14 — Shadowing d'Outils dans MCP](step_14.md)

---

## Ressources

| Information                                                                       | Lien                                                                                                                                                                                                         |
|-----------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| GitHub Codespaces Documentation                                                   | [https://docs.github.com/en/codespaces](https://docs.github.com/en/codespaces)                                                                                                                               |
| VS Code Dev Containers                                                            | [https://code.visualstudio.com/docs/devcontainers/containers](https://code.visualstudio.com/docs/devcontainers/containers)                                                                                   |
| Docker Compose Documentation                                                      | [https://docs.docker.com/compose/](https://docs.docker.com/compose/)                                                                                                                                         |
| Model Context Protocol — Specification                                            | [https://spec.modelcontextprotocol.io/](https://spec.modelcontextprotocol.io/)                                                                                                                               |
