# PyRIT: framework for security risk Identification and Red Teaming in Generative AI System

[<img src="img/step10.jpg" alt="gandalf" width="800">](https://www.youtube.com/watch?v=__m75rCcusM)
> "They broke our defenses. They've taken the bridge and the West bank. Battalions of orcs are crossing the river", Gandalf, LOTR - The Return of the King


## 🎯 Objectifs de cette étape

- **Découvrir PyRIT** : comprendre son fonctionnement, son architecture et ses composants clés (Targets, Stratégies, Scoring, etc.).
- **Installer l'environnement** : cloner le dépôt et configurer les dépendances nécessaires au fonctionnement du framework.
- **Configurer une attaque ciblée** : préparer l'orchestrateur pour attaquer le playground Gandalf.
- **Mener des attaques automatisées** : exploiter PyRIT pour franchir progressivement les barrières de chaque niveau (jusqu'au niveau 7).
- **Adapter ses stratégies** : analyser les blocages et mettre en place de nouvelles stratégies de prompt injection face à l'augmentation de la difficulté.



## Sommaire
- [Objectif principal](#objectif-principal)


- [PyRIT](#présentation-de-pyrit)
  - [Présentation de PyRIT](#présentation-de-pyrit)
  - [À quoi sert PyRIT ?](#à-quoi-sert-pyrit-)
  - [Comment ça fonctionne ?](#comment-ça-fonctionne-)
  - [Quels sont les 5 composants de PyRIT ?](#quels-sont-les-5-composants-de-pyrit-)
  - [schema d'architecture PyRIT](#schema-darchitecture-pyrit)

- [Let's play with PyRIT !](#Let's-play-with-PyRIT-)
  - [Installation de PyRIT](#installation-de-pyrit)
    - [Installation de PyRIT dans Codespace](#installation-de-pyrit-dans-codespace)
    - [Installation de PyRIT en local](#installation-de-pyrit-en-local)
  - [Stratégies d'attaque](#stratégies-dattaque)
  - [Jouer avec PyRIT](#jouer-avec-pyrit)
    - [Configurer les paramètres](#configurer-les-paramètres)
    - [Comprendre le code](#comprendre-le-code)
    - [Lancer l'attaque](#lancer-lattaque)
    - [Ça bloque déjà ?!](#ça-bloque-déjà-)
    - [Solutions](#solutions)


- [Étape suivante](#étape-suivante)
- [Ressources](#ressources)

## Objectif principal

Dans cette partie, nous allons exploitez les fonctionnalités d’attaque automatisée de PyRIT pour tester la sécurité du
[playground Gandalf](https://gandalf.lakera.ai/) jusqu’au niveau 7.

L’objectif est de franchir progressivement les barrières de chaque niveau, en surmontant les défis croissants conçus 
pour résister aux manipulations et à l’extraction de données sensibles.

<img src="img/gandalf_target_level_7.jpg" alt="gandalf levels" width="600" style="transition:0.3s;">

## PyRIT

![GitHub stars](https://img.shields.io/github/stars/microsoft/PyRIT?style=flat-square)
[![Downloads](https://static.pepy.tech/badge/pyrit/month)](https://pepy.tech/project/pyrit)

**PyRIT** (Python Risk Identification Toolkit) est un framework open-source conçu pour faciliter l’identification des 
risques de sécurité dans les systèmes d’IA générative, via des approches de red teaming structurées et reproductibles.

### Présentation de PyRIT

**PyRIT** est un outil qui permet d’évaluer la robustesse et la sécurité des modèles d’IA générative (LLM, modèles 
multimodaux, etc.) en simulant, automatisant et analysant différents types d’attaques et comportements risqués. 

Il se veut agnostique par rapport aux modèles et plateformes : il peut donc être utilisé pour tester une large variété 
d’IA, quel que soit leur fournisseur ou leur type.

### A quoi sert PyRIT ?

- **Identifier les failles et vulnérabilités** dans les modèles d’IA générative (par exemple : jailbreaks, biais, contenus dangereux, attaques par injection de prompt, etc.).


- **Structurer et automatiser les tests de red teaming** (tests d’attaque par des "gentils hackers") pour évaluer les risques réels des modèles avant leur mise en production.


- **Établir des bases de comparaison et des métriques** pour mesurer les progrès ou comparer différents modèles ou itérations.


### Comment ça fonctionne ?

Le framework repose sur une architecture modulaire : chaque composant (attaque, cible, transformateur, système de 
scoring) peut être personnalisé et assemblé pour créer des flux d’évaluation adaptés à différents scénarios.

1.  On choisit d’abord un "attack/executor" (anciennement orchestrateur) pour déterminer le type d’attaque/scénario souhaité (simple prompt, attaque 
sur plusieurs tours, attaque sur document externe, etc.).


2.  On configure la cible (le modèle d’IA ou l’API à tester).


3. On utilise des "converters" pour transformer ou modifier les prompts afin de tester la résistance du modèle aux 
différentes variations (traductions, substitutions, leetspeak, etc.).


4. On définit la stratégie d’attaque : prompts simples, templates à compléter, ou attaque générée dynamiquement par une
IA attaquante.


5. On évalue les réponses obtenues en utilisant des techniques de scoring : classification de contenu, échelle de 
Likert, ou personnalisation selon les besoins.

Dès lors, la modularité permet de composer ces briques pour couvrir des scénarios très variés et réalistes.


### Quels sont les 5 composants de PyRIT ?


| Module                | Description                                                                              | Exemples/Types                                                                                                                                                  |
|-----------------------|------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Attacks / Executors** | Coordonnent le déroulement de l’attaque et la logique de dialogue (anciennement Orchestrators) | PromptSendingAttack, RedTeamingAttack, CrescendoAttack, etc.                                                                                                    |
| **Converters**        | Transforment les prompts pour tenter de contourner les gardes fous                       | leetspeak, ROT13, unicode confusable, variation/translation, etc.                                                                                               |
| **Targets**           | Interface vers le modèle à tester                                                        | API d’inférence, modèles chat, multimodal, stockage externe                                                                                                     |
| **Attack Strategies** | Définissent les objectifs d’attaque et la génération des prompts                         | Manuel, automatisé via IA attaquante                                                                                                                            |
| **Scoring**           | Analyse et évalue les réponses du modèle                                                 | Classificateurs de contenu (biais, thématique), échelles de Likert (graduation sur 5 niveaux), évaluations personnalisées (booléen, string, mot de passe, etc.) |


Pour les attaques (anciennement orchestrateurs), voici quelques details supplémentaires :
- **PromptSendingAttack** : envoie un prompt simple au modèle et analyse la réponse.
- **RedTeamingAttack** : simule une attaque de red teaming sur plusieurs tours de dialogue.
- **CrescendoAttack** : attaque multi-tours progressive (basée sur une stratégie d'escalade des requêtes).
- D'autres attaques et exécuteurs spécialisés gèrent les "end tokens" ou les scénarios complexes comme XPIA.


### schema d'architecture PyRIT

                        +---------------------+
                        | Attacks & Executors |
                        +---------+-----------+
                                  |
               +------------------|----------------------+
               |                  |                      |
       +-------v-----+    +-------v-------+     +--------v-------+
       |  Converter  |    |   Attack      |     |    Memory      |
       | (Prompt     |    |  Strategy     |     | (Logs, Recall) |
       | Transform   |    | (Objective,   |     |                |
       +-------------+    |  Templates)   |     +----------------+
               |          +---------------+               |
               |                  |                       |
       +-------v------------------+-----------------------v------+
       |                      Target (Model/API)                 |
       +-----------------------------+---------------------------+
                                     |
                            +--------v--------+
                            |   Scoring       |
                            | (Classifier,    |
                            | Likert Scale)   |
                            +-----------------+



## Let's play with PyRIT !

### Installation de PyRIT dans Codespace

Depuis le terminal de codespace, PyRIT est déjà pré-installé. Vous pouvez vérifier en exécutant la commande suivante :

  ```bash
  uv pip freeze | grep -i Pyrit
  ```

### Installation de PyRIT en local

Si vous n'avez pas déjà installé PyRIT, voici comment faire depuis votre terminal. Placez-vous dans le dossier où vous souhaitez installer le projet, par exemple **Documents**,
puis exécutez la commande suivante pour cloner le dépôt et entrer automatiquement dans le dossier créé :

```bash
git clone https://github.com/microsoft/PyRIT.git --depth 1 && cd PyRIT
```

Ensuite, créez un environnement virtuel Python, activez-le, puis installez les dépendances du projet avec les commandes
suivantes :

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


```bash
# Assurez d'être dans le venv créé à la racine du projet du lab
# Check que vous êtes dans le bon venv ;) On est jamais trop prudent
# Celui à la racine du repo.
[[ "${VIRTUAL_ENV-}" == *"devoxxfr2026-workshop-jailbreak-prompt-injection-mcp-poisoning"* ]] || { echo "❌ Wrong/missing venv" >&2; return 1 2>/dev/null || exit 1; }

# 3. Mettre à jour pip, setuptools et wheel dans l’environnement
uv pip install --upgrade pip setuptools wheel

# 4. Installer la dépendance requise
uv pip install IPython

# 5. Installer ce projet localement en mode développement (utile pour développement/débogage)
uv pip install -e .
```

Après exécution, vous devriez obtenir des messages indiquant la création de l’environnement virtuel, puis l’installation
des dépendances du projet. Par exemple :

<img src="img/pyrit-install.png" alt="Pyrit install" width="600" style="transition:0.3s;">


### Stratégies d'attaque

                +--------------------------+
                |   Définir l'Objectif     |
                +-----------+--------------+
                            |
                            v
                +--------------------------+
                |  Choisir AttackStrategy  |
                +-----------+--------------+
                            |
                            v
                +--------------------------+
                |  Générer ou choisir le   |
                |        prompt            |
                +-----------+--------------+
                            |
                            v
                +--------------------------+
                |    Appliquer Converter   |
                | (Transformation prompt)  |
                +-----------+--------------+
                            |
                            v
                +--------------------------+
                |   Envoyer au Target      |
                |   (modèle testé)         |
                +-----------+--------------+
                            |
                            v
                +--------------------------+
                |   Récupérer la réponse   |
                +-----------+--------------+
                            |
                            v
                +--------------------------+
                |     Scoring/Évaluation   |
                +-----------+--------------+
                            |
                            v
                +--------------------------+
                |      Enregistrer         |
                |    Score & logs          |
                +--------------------------+

## Jouer avec PyRIT

Dans cette section, nous allons utiliser PyRIT pour mener des attaques sur la plateforme Gandalf. Comme mentionné 
précédemment, l’objectif est de progresser à travers les niveaux pour atteindre le niveau 7 !

Allez dans le  dossier **lab/PyRIT** de ce codelab.

### Configurer les paramètres

Ouvrez le fichier **settings.yml** et renseignez votre clé OpenAI ainsi que le modèle à utiliser.

> Il est recommandé de débuter avec un modèle léger, tel que gpt-3.5-turbo. Ensuite, à mesure que la difficulté 
> augmente et que vous maîtrisez mieux le code, vous pouvez passer à un modèle plus performant — donc plus coûteux et 
> plus rapide — comme gpt-4o-mini, que nous avons utilisé pour les exercices les plus complexes.


### Comprendre le code


Le code de base de cet exercice s’appuie sur la documentation officielle de PyRIT et l'exemple Gandalf :
https://github.com/microsoft/PyRIT/blob/main/doc/code/targets/6_custom_targets.ipynb
*(Anciennement disponible sur azure.github.io/PyRIT/code/targets/2_custom_targets.html)*.

Nous avons toutefois adapté ce code pour le codelab.


### Lancer l'attaque

Pour exécuter le script, utilisez la commande suivante dans votre terminal :

```bash
python gandalf.py
```

Vous devriez avoir ce type de rendu :

<img src="img/gandalf_level_1_example.jpg" alt="Pyrit gandalf level 1" width="600" style="transition:0.3s;">

Pour progresser dans les niveaux, il suffit de relancer la commande en prenant soin de modifier le niveau dans le 
fichier gandalf.py en ligne 48 :

```python
gandalf_level = GandalfLevel.LEVEL_1
```


### Ça bloque déjà ?!

Comme évoquer dans la documentation, cet exemple de code fonctionne pour les premiers niveaux :

> Gandalf contains 7 different levels. In this demo, we will show how to automatically bypass (at least) the first 
> couple. It uses the RedTeamingAttack as a strategy to solve these challenges.
Each level gets progressively more difficult. Before continuing, it may be beneficial to manually try the Gandalf 
> challenges to get a feel for how they are solved.


Comment resoudre les niveaux supérieurs ? Voici quelques pistes :

- La compréhension de la logique d'attaque est expliqué dans ce document : https://arxiv.org/abs/2410.02828
- Tout se passe dans **Stratégie d'attaque**
- Il y a une reférence à l'étape 6


### Solutions

[solutions/step10.md](solutions/step10.md)

## Étape suivante

- [Étape 11](step_11.md)

## Ressources


| Information                                                                       | Lien                                                                                                                                                                                                           |
|-----------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| PyRIT: A Framework for [...] Red Teaming in Generative AI System                  | [https://arxiv.org/abs/2410.02828](https://arxiv.org/abs/2410.02828)                                                                                                                                           |
| PyRIT - Documentation officielle                                                  | [https://microsoft.github.io/PyRIT/](https://microsoft.github.io/PyRIT/)                                                                                                                                       |
| PyRIT - Github                                                                    | [https://github.com/microsoft/PyRIT](https://github.com/microsoft/PyRIT)                                                                                                                                       |
| Youtube - PyRIT: A Framework for  [...] Red Teaming in Generative AI Systems      | [https://www.youtube.com/watch?v=KnV8Y97YKmU](https://www.youtube.com/watch?v=KnV8Y97YKmU)                                                                                                                     |
| Hacking generative AI with PyRIT  Black Hat Arsenal USA 2024                      | [https://www.youtube.com/watch?v=M_H8ulTMAe4](https://www.youtube.com/watch?v=M_H8ulTMAe4)                                                                                                                     |
| Red Teaming GenAI: The PyRIT Framework for Proactive Risk Identification          | [https://www.linkedin.com/pulse/red-teaming-genai-pyrit-framework-proactive-risk-p-raquel-bise--vh1ae/](https://www.linkedin.com/pulse/red-teaming-genai-pyrit-framework-proactive-risk-p-raquel-bise--vh1ae/) |
| PyRIT: Secure AI with Microsoft's Latest Tool (How-To)                            | [https://www.youtube.com/watch?v=HO4PW7aFmIU](https://www.youtube.com/watch?v=HO4PW7aFmIU)                                                                                                                     |
| BlueHat 2024: S24: Automate AI Red Teaming in your existing tool chain with PyRIT | [https://www.youtube.com/watch?v=wna5aIVfucI](https://www.youtube.com/watch?v=wna5aIVfucI)                                                                                                                     |
| Red Teaming AI: A Closer Look at PyRIT                                            | [https://medium.com/@dinber19/red-teaming-ai-a-closer-look-at-pyrit-e912c3a094ec](https://medium.com/@dinber19/red-teaming-ai-a-closer-look-at-pyrit-e912c3a094ec)                                             |
| Zero Day Quest - Learn to Red Team AI Systems Using PyRIT.                        | [https://www.youtube.com/watch?v=jq9DcEL3cHE](https://www.youtube.com/watch?v=jq9DcEL3cHE)                                                                                                                     |
| Microsoft AI Red Team ❤️ OpenAI GPT-5                                             | [https://www.linkedin.com/posts/ugcPost-7360830937988845570-388-/](https://www.linkedin.com/posts/ugcPost-7360830937988845570-388-/)                                                                           |
