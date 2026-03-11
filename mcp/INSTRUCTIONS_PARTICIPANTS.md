# 🚀 DevoxxFR 2026 - Workshop : Jailbreak, Prompt Injection & MCP Poisoning

Bienvenue dans le workshop ! Afin de garantir que tout le monde puisse coder, tester et casser des choses dans d'excellentes conditions, nous utilisons des environnements de développement isolés dans le Cloud. 

**Vous n'avez besoin que d'un navigateur web.** Toutes les dépendances (Node.js, Docker, TypeScript) sont déjà préconfigurées.

## Étape 1 : Lancer votre environnement

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

## Étape 2 : Découverte des Labs

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

**Bon Workshop (et bon piratage) ! 🏴‍☠️**
