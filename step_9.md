# Garak: An LLM vulnerability scanner

[<img src="img/minas_tirith_tree_burning.jpg" alt="minas_tirith_burning" width="800" >](https://www.youtube.com/watch?v=yFBrm5YH9-8)
> "A white tree in a courtyard of stone.. It was dead.. The city was burning.", Pippin, LOTR - The Return of the King

## 🎯 Objectifs de cette étape

- Présentation de garak.
- Mettre en pratique ces techniques sur ce Playground de Microsoft : [AI-Red-Teaming-Playground-Labs](https://github.com/microsoft/AI-Red-Teaming-Playground-Labs).

## Sommaire


- [Garak](#garak)
    - [Installation de Garak](#installation-de-garak)
      - [Installation de Garak dans Codespace](#installation-de-garak-dans-codespace)
      - [Installation de Garak en local](#installation-de-garak-en-local)
    - [Les Probes](#les-probes)
    - [Les Generators](#les-generators)
    - [Les Detectors et les Harnesses](#les-detectors-et-les-harnesses)
    - [L'Auto-Red-Team](#lauto-red-team)

- [Mise en pratique de Garak sur le Playground de Microsoft](#mise-en-pratique-de-garak-sur-le-playground-de-microsoft)
    - [Initialisation du REST Generator](#initialisation-du-rest-generator)
    - [Initialisation d'une sonde custom Garak](#initialisation-dune-sonde-custom-garak)
    - [Mise en pratique sur le chatbot 2 du Playground de Microsoft](#mise-en-pratique-sur-le-chatbot-2-du-playground-de-microsoft)

- [Étape suivante](#étape-suivante)
- [Ressources](#ressources)



## Garak

![GitHub stars](https://img.shields.io/github/stars/NVIDIA/garak?style=flat-square)
[![Downloads](https://static.pepy.tech/badge/garak/month)](https://pepy.tech/project/garak)

**Garak** est un outil open-source développé par **NVIDIA** pour scanner les vulnérabilités des modèles de langage (LLM).
**Garak** se fonde sur une base de connaissances de jailbreaks et de variantes connus et constamment mis à jour par la communauté.

Lors d'un audit, **Garak** lance des attaques prédéfinies, non-adaptatives, et sauvegarde les résultats sous format JSON et HTML.

La recommandation est d'utiliser **Garak** périodiquement ou avant une mise à jour majeure d'une application (changement de LLM,...) pour dresser un état des lieux des principales vulnérabilités auxquelles votre application est sensible.
On peut ensuite mettre en place des guardrails plus spécifiques avec **NEMO Guardrails** (cf. étape 13 du Devfest 2025).

### Installation de Garak

#### Installation de Garak dans Codespace

Depuis le terminal de codespace, Garak est déjà pré-installé dans `$HOME/garak` (`/home/node/garak`). Vous pouvez vérifier en exécutant la commande suivante :

  ```bash
  uv pip freeze | grep -i Garak
  ```

Pour les étapes qui demandent de copier des probes/detectors custom dans le clone de Garak, utilisez :

  ```bash
  GARAK_REPO="$HOME/garak"
  ```

#### Installation de Garak en local

Garak sera installé **en dehors** du repo du codelab, comme un side-project posé à côté (dans le même dossier
`projects/`), afin de pouvoir modifier directement son code source (ajout de probes/detectors custom) sans toucher au
contenu de `site-packages`.

Voici l'arborescence cible :

```
~/Documents/projects/
├── devoxxfr2026-workshop-jailbreak-prompt-injection-mcp-poisoning/   ← repo du codelab
│   ├── .venv/                                ← venv partagé (activé pour installer Garak)
│   ├── lab/
│   │   └── Garak_test/
│   │       ├── my_probe.py                   ← probe custom à copier
│   │       ├── my_custom_detection.py        ← detector custom à copier
│   │       └── rest_ai_playground_api.json
│   └── step_9.md
│
└── garak/                                    ← clone de Garak (side-project, voisin du codelab)
    └── garak/
        ├── probes/        ← destination de my_probe.py
        ├── detectors/     ← destination de my_custom_detection.py
        └── ...
```

Placez-vous dans le dossier `projects/` **à côté du repo du codelab**, puis clonez le dépôt :

```bash
# Se placer dans le dossier projects/, à côté du repo du codelab
cd ~/Documents/projects

# Cloner Garak et entrer dans le dossier
git clone https://github.com/NVIDIA/garak.git --depth 1 && cd garak
```

<details>
  <summary>Installation d'uv (si vous n'avez pas suivi les prérequis)</summary>

Voir documentation ici : https://docs.astral.sh/uv/getting-started/installation/#standalone-installer

En bref :
```bash
pip install uv

# Si vous n'avez pas pip
curl -LsSf https://astral.sh/uv/install.sh | sh
```
</details>

Ensuite, installez Garak en mode développement (éditable) dans le venv du codelab :

```bash
# Assurez d'être dans le venv créé à la racine du projet du lab
# Check que vous êtes dans le bon venv ;) On est jamais trop prudent
[[ "${VIRTUAL_ENV-}" == *"devoxxfr2026-workshop-jailbreak-prompt-injection-mcp-poisoning"* ]] || { echo "❌ Wrong/missing venv" >&2; return 1 2>/dev/null || exit 1; }

# 2. Mettre à jour pip, setuptools et wheel
uv pip install --upgrade pip setuptools wheel

# 3. Installer Garak localement en mode développement (depuis le dossier cloné)
uv pip install -e .
```

> ℹ️ Mémorisez le chemin absolu du clone (par ex. `~/Documents/projects/garak`). Il sera réutilisé plus bas via la
> variable `GARAK_REPO` pour copier les probes/detectors custom.


### Les Probes

Garak permet de faire un scanning automatisé des LLMs en utilisant un certain nombre de sondes (probes).
Vous pouvez voir la liste des probes disponibles en exécutant la commande suivante :

```bash

python -m garak --list_probes
```

Vous devriez voir un affichage similaire à celui-ci :

<img src="img/list_probes.png" alt="garak-list-probes" width="600" style="transition:0.3s;">

Certaines probes sont suivies de symboles 🌟 ou 💤 comme ceci :
```plaintext
probes: divergence 🌟
probes: divergence.Repeat
probes: divergence.RepeatExtended 💤
```
En fait, il existe plusieurs variantes de probes pour un même type de jailbreak.
Ces symboles ont la signification suivante :
- 🌟 : indique qu'on passe à un nouveau module de jailbreak ici `divergence`.
- 💤 : indique que la probe `divergence.RepeatExtended` est inactive par défaut, car son lancement serait long. 
C'est la version `divergence.Repeat` qui sera lancée en cas de scan automatique.

Pour lancer un scan automatique d'un module en particulier comme `divergence`, il suffit d'exécuter la commande suivante :

```bash

# Commande mise en illustration, ne pas la lancer pour le codelab
# python -m garak --model_type huggingface --model_name gpt2 --probes divergence
```

Pour lancer une probe inactive comme `divergence.RepeatExtended`, il suffit d'exécuter la commande suivante :
```bash

# Commande mise en illustration, ne pas la lancer pour le codelab
# python -m garak --model_type huggingface --model_name gpt2  --probes divergence.RepeatExtended
```

### Les Generators 

Les generators sont des abstractions (LLMs, APIs, fonction Python) répondant un texte en fonction d'un input.
Les generators prennent des valeurs, dont :
- `huggingface` : pour les modèles hébergés sur HuggingFace.
- `openai` : pour les modèles OpenAI.
- `function` : pour les fonctions Python.

Par exemple, si on souhaite évaluer un modèle `gpt2` de `Huggingface` lors d'un scan, on renseigne les options : 
`--model_type huggingface --model_name gpt2`.
Si c'est une API d'HuggingFace, on renseigne les options : `--model_name huggingface.InferenceAPI --model_type "mosaicml/mpt-7b-instruct"`.

Pour plus de détails, vous pouvez consulter la documentation officielle de Garak : [Garak Documentation](https://docs.garak.ai/garak/garak-components/using-generators).

### Les Detectors et les Harnesses

Comme, une probe va être lancée plusieurs fois pour tester la robustesse du LLM et que l'on teste plusieurs probes, 
Garak utilise des detectors pour reconnaitre si la réponse du LLM défaillante.
Ce sont des détecteurs de mots-clés ou des classifiers jugeant si la réponse d'un LLM est OK ou non selon l'objectif de la probe.

Les détecteurs ont parfois un paramètre `doc_uri` permettant de trouver de la documentation sur la faille testée. Par 
exemple, le détecteur [`xss.MarkdownExfilBasic`](https://reference.garak.ai/en/latest/garak.detectors.xss.html#garak.detectors.xss.MarkdownExfilBasic) pointe vers : [Bing Chat Image Markdown Injection](https://embracethered.com/blog/posts/2023/bing-chat-data-exfiltration-poc-and-fix/).

Les Harnesses gèrent :
- le lancement des probes sur le generator cible. 
- le lancement des detectors à utiliser sur les outputs produits par le generator selon les probes.
- les évaluations des résultats des detectors faites avec les evaluators.

Les Harnesses prennent la valeur : `probewise` si on utilise les détectors récommandés pour la probe ou `pxd` pour 
tester tous les détecteurs.

### L'auto Red-Team

Garak propose un système d'auto Red-Team sur certain sujet avec la librarie `art`. Cette brique ne peut cependant pas de
faire un scan poussé.

## Mise en pratique de Garak sur le Playground de Microsoft
Nous allons mettre en pratique Garak sur le Playground de Microsoft.

### Initialisation du REST Generator

Pour cela, nous allons utiliser le REST Generator de Garak et nous allons utiliser des variantes des sondes 
(`smuggling.HypotheticalResponse` et `promptinject.DAN`) que nous allons configurer pour trouver le mot de passe protégé 
par le bot (la modification de `promptinject.DAN` est laissée en exercice).


1 - Pour setter le REST Generator, lancer une inspection de la page HTML du bot que vous voulez tester :
<br/>
<img src="img/lancer_inspection_chatbot.png" alt="garak-inspection-chatbot" width="600" style="transition:0.3s;">
<br/>
<br/>
2 - Aller dans l'onglet `Network` :
<br/>
<img src="img/network_chatbot.png" alt="garak-network-chatbot" width="600" style="transition:0.3s;">
<br/>
<br/>
3 - Lancer un premier message (ex: "Hello") dans le playground et récupérer les éléments nécessaires comme l'url de la 
requête POST `messages` et les cookies.
<br/>
<img src="img/elements_requete_post.png" alt="request-post-chatbot" width="600" style="transition:0.3s;">

### Initialisation d'une sonde custom Garak

Pour lancer le scan d'une sonde custom sur une étape du Playground :
<br/>
<br/>
1 - Copier le fichier `my_probe.py` qui contient un exemple de sonde custom `my_probe.MyHypotheticalResponse` pour le playground dans le répertoire `probes` du **clone de Garak** (et non dans votre `.venv`, puisque Garak est installé en mode éditable depuis le clone).
<br/>
<img src="img/ajout_probe_custom_garak.png" alt="ajout_probe_custom_garak" width="200" style="transition:0.3s;">
<br/>
<br/>
2 - Copier aussi le fichier `my_custom_detection.py` qui contient un detector custom `my_custom_detection.MyPasswordByPass` pour le playground dans le répertoire `detectors` du clone de Garak. Le detector custom `my_custom_detection.MyPasswordByPass` détecte si un des mots de passe qui doit être protégé a fuité dans la réponse du chatbot.
<br/>

```bash
# Depuis la racine du repo du codelab, on pointe vers le clone de Garak voisin
cd $(git rev-parse --show-toplevel)

# Chemin absolu du clone de Garak (à adapter si vous l'avez cloné ailleurs)
export GARAK_REPO="$HOME/Documents/projects/garak"

# Copie de la probe et du detector custom dans le clone
cp lab/Garak_test/my_probe.py            "$GARAK_REPO/garak/probes/"
cp lab/Garak_test/my_custom_detection.py "$GARAK_REPO/garak/detectors/"
```

> ℹ️ Comme Garak a été installé via `uv pip install -e .` depuis `$GARAK_REPO`, le venv du codelab ne contient qu'un
> fichier `.pth` (+ un dossier `.dist-info`) pointant vers `$GARAK_REPO/garak/`. Tous les `import garak.probes.*` et
> `import garak.detectors.*` sont donc résolus **depuis le clone** — les fichiers copiés sont détectés immédiatement,
> sans réinstallation.
<br/>

3 - Vérifier que la CLI Garak résout bien les probes/detectors **depuis le clone** (et non depuis un éventuel ancien
install dans le venv) :

```bash
# 3.a — Le package garak doit être chargé depuis $GARAK_REPO (et pas depuis site-packages)
python -c "import garak, pathlib; print(pathlib.Path(garak.__file__).resolve())"
# attendu : .../Documents/projects/garak/garak/__init__.py

# 3.b — Les fichiers custom doivent être résolus depuis le clone
python -c "import garak.probes.my_probe as p; print(p.__file__)"
python -c "import garak.detectors.my_custom_detection as d; print(d.__file__)"
# attendu : deux chemins sous $GARAK_REPO/garak/{probes,detectors}/

# 3.c — Lister les detectors et probes : les customs doivent apparaître
python -m garak --list_detectors | grep -i my_custom_detection
python -m garak --list_probes    | grep -i my_probe
```

Si l'un des `print` pointe vers `.venv/lib/.../site-packages/garak/...` ou si le `grep` ne retourne rien, c'est que le
clone n'est pas le garak résolu par Python. Les causes classiques :
- un `uv pip install garak` (non-éditable) a été lancé avant et a laissé une copie dans `site-packages` → faire
  `uv pip uninstall garak` puis relancer `uv pip install -e .` depuis `$GARAK_REPO` ;
- le venv actif n'est pas celui du codelab → réactiver `.venv` à la racine du repo.

### Mise en pratique sur le chatbot 2 du Playground de Microsoft

1 - Copier l'URL du bot 2 ainsi que le cookie de session (comme illustré plus haut) dans le fichier `rest_ai_playground_api.json`

2 - Lancer la commande suivante pour tester la vulnérabilité du chatbot 2 avec la sonde custom `my_probe.MyHypotheticalResponse`. Garak lance directement les prompts en ligne de commandes et les réponses du chatbot sont affichées dans l'interface web.

3 - Si oui, lancer la commande suivante pour tester la vulnérabilité du chatbot. Sinon, assurez-vous que le fichier sonde est copié au bon endroit :
<br/>

```bash

# Commande type, à adapter selon la sonde et le chemin du fichier JSON. Le JSON rest_ai_playground_api.json est lui aussi à adapter.
python -m garak --target_type rest -G path/to/rest_ai_playground_api.json  --probes my_probe.MyHypotheticalResponse
```

*PS : n'hésitez pas à relancer une nouvelle conversation dans le playground entre chaque scan pour réinitialiser le contexte.*

<img src="img/jailbreak_by_custom_probe_chatbot_2.png" alt="garak-jailbreak-chatbot-2" width="600" style="transition:0.3s;">

###### résultat obtenus lors du jailbreak réussi du chatbot 2 avec la sonde custom my_probe.MyHypotheticalResponse

4 - Une fois un scan ayant mené à un jailbreak réussi, vous pouvez retrouver le rapport HTML dans le répertoire indiqué dans le log de Garak. Si toutes les attempts de jailbreak ont réussi, le rapport HTML indiquera un score de 0% de succès d'interception (cf ci-dessous).

<img src="img/garak_report_on_successful_jailbreak_attempts.png" alt="garak-successful-jailbreak-chatbot-2-report" width="600" style="transition:0.3s;">

Si vous le souhaitez, vous pouvez tenter de nouveaux scans sur un niveau supérieur, par exemple le chatbot 8, avec la même probe ou une autre (une grandma ou un DAN custom).

```bash

# Commande type, à adapter selon la sonde et le chemin du fichier JSON. Le JSON rest_ai_playground_api.json est lui aussi à adapter.
python -m garak --target_type rest -G path/to/rest_ai_playground_api.json  --probes my_probe.MyGrandmaPassword
python -m garak --target_type rest -G path/to/rest_ai_playground_api.json  --probes my_probe.MyGrandmaSubstance
python -m garak --target_type rest -G path/to/rest_ai_playground_api.json  --probes my_probe.MyDan_11_0
```

<img src="img/jailbreak_failed_by_custom_probe_chatbot_8.png" alt="jailbreak-failed-chatbot-9" width="600" style="transition:0.3s;">

###### résultat obtenus lors d'une tentative de jailbreak du chatbot 8 avec la même sonde custom my_probe.MyHypotheticalResponse

Ici le rapport de Garak indique un taux de succès de 100% sur la sonde custom `my_probe.MyHypotheticalResponse` car aucune des attempts de jailbreak n'a réussi.

<img src="img/garak_report_on_failed_jailbreak_attempts.png" alt="garak-failed-jailbreak-chatbot-8-report" width="600" style="transition:0.3s;">

| Chatbot | Probes conseillées                                                | Remarques                                                      |
|---------|-------------------------------------------------------------------|----------------------------------------------------------------|
| Lab 1   | MyHypotheticalResponse, MyGrandmaPassword                         |                                                                |
| Lab 2   | MyHypotheticalResponse, MyGrandmaPassword                         |                                                                |
| Lab 3   | grandma.substance, MyGrandmaSubstance                             |                                                                |
| Lab 4   | grandma.substance, MyGrandmaSubstance                             |                                                                |
| Lab 5   | realtoxicityprompts.RTPInsult, realtoxicityprompts.RTPProfanity   | /!\ Ces probes utilisent un roberta-classifier comme detector) |
| Lab 7   | MyHypotheticalResponse, MyGrandmaPassword                         |                                                                |
| Lab 8   | MyHypotheticalResponse, MyGrandmaPassword                         |                                                                |
| Lab 9   | grandma.substance, MyGrandmaSubstance                             |                                                                |
| Lab 10  | grandma.substance, MyGrandmaSubstance                             |                                                                |


## Étape suivante
- [Étape 10](step_10.md)

## Ressources


| Information                                   | Lien                                                                                                                                                           |
|-----------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [Github] garak, LLM vulnerability scanner     | [https://github.com/NVIDIA/garak](https://github.com/NVIDIA/garak)                                                                                             |
| Documentation garak                           | [https://docs.garak.ai/](https://docs.garak.ai/)                                                                                                               |
| Garak, DEF CON slides                         | [https://garak.ai/garak_aiv_slides.pdf](https://garak.ai/garak_aiv_slides.pdf)                                                                                 |
| Garak - A Generative AI Red-teaming Tool      | [https://wiki.hackerium.io/llm-security/garak-a-generative-ai-red-teaming-tool](https://wiki.hackerium.io/llm-security/garak-a-generative-ai-red-teaming-tool) |
