# Introduction au MCP

[<img src="img/step10.jpg" alt="gandalf" width="800">](https://www.youtube.com/watch?v=__m75rCcusM)
> "They broke our defenses. They've taken the bridge and the West bank. Battalions of orcs are crossing the river", Gandalf, LOTR - The Return of the King


## 🎯 Objectifs de cette étape

- Comprendre le problème de l'intégration des outils dans les LLM
- Comprendre ce qu'est le MCP
- Comprendre comment fonctionne le MCP
- Comprendre les bénéfices stratégiques du MCP
- Comprendre l'avenir du MCP


## Sommaire

- [L'origine du MCP et le problème de l'intégration (Le Chaos des Outils)](#l'origine-du-mcp-et-le-problème-de-lintégration-le-chaos-des-outils)
    - [Le cauchemar de l'intégration M×N](#le-cauchemar-de-lintégration-m×n)
    - [Les conséquences pour le développement](#les-conséquences-pour-le-développement)
    - [Le parallèle avec la révolution "Cloud Native"](#le-parallèle-avec-la-révolution-cloud-native)
    - [Autres protocoles dans Agentic AI](#autres-protocoles-dans-agentic-ai)
    - [Exemples et cas d'utilisation pour les agents](#exemples-et-cas-d'utilisation-pour-les-agents)


- [Qu'est-ce que le MCP ? (La Réponse aux problèmes)](#qu'est-ce-que-le-mcp-la-réponse-aux-problèmes)
- [Comment fonctionne le MCP ? (L'Architecture et les Composants)](#comment-fonctionne-le-mcp-l'architecture-et-les-composants)
- [Conclusion : Les bénéfices stratégiques et l'Avenir](#conclusion-les-bénéfices-stratégiques-et-l'avenir)
- [Étape suivante](#étape-suivante)
- [Ressources](#ressources)


## L'origine du MCP et le problème de l'intégration (Le Chaos des Outils)

Le protocole MCP tire ses origines d'une initiative interne de chez Anthropic. À l'époque, David Soria Parra (https://www.linkedin.com/in/david-soria-parra-4a78b3a/), ingénieur logiciel, utilisait Claude Desktop(https://claude.com/fr-fr/download) au quotidien pour concevoir des outils de développement. Lassé des allers-retours incessants et des copier-coller entre l'assistant IA et son éditeur de code (une contrainte bien connue de ceux qui ont utilisé l'IA avant l'intégration directe dans les éditeurs), il a décidé de s'inspirer de ses travaux sur le Language Server Protocol (LSP) (https://microsoft.github.io/language-server-protocol/) pour résoudre ce problème.
Le LSP est un protocole ouvert basé sur JSON-RPC qui relie un client à un serveur afin d'enrichir les éditeurs de code (IDE) avec des fonctionnalités linguistiques avancées. Si vous utilisez l'autocomplétion classique, l'affichage des définitions au survol ou le re-nommage global de variables, vous utilisez le LSP ! 

Conçu à l'origine par Microsoft pour VS Code et standardisé en 2016, il est rapidement devenu la norme de l'industrie pour équiper les IDE de ces fonctionnalités expertes.

### Le cauchemar de l'intégration M×N 

En cherchant à résoudre son propre problème, David Soria Parra a réfléchi à un moyen de simplifier globalement la création d'intégrations pour Claude Desktop et les LLM. Il a mis le doigt sur un défi majeur de l'industrie, le fameux problème "MxN" : relier M modèles de langage à N outils nécessite de développer un nombre exponentiel de connecteurs (MxN). 
Le problème de l'intégration "M×N" décrit le casse-tête architectural auquel sont confrontés les développeurs d'applications d'IA. Concrètement, si une entreprise utilise plusieurs modèles d'IA (appelé M), tels que Gemini, Claude et un modèle OpenAI, et souhaite les connecter à plusieurs outils ou sources de données (appelé N), elle doit multiplier les ponts de connexion. Par exemple, pour connecter 5 modèles différents à 3 outils (comme une base de données, une API et  un calendrier), les développeurs doivent créer et gérer 15 points d'intégration distincts (la chance ! ;) )
Ces intégrations sont "spécifiques" parce que chaque fournisseur d'IA impose son propre langage et sa propre syntaxe pour utiliser des outils. 
Par exemple :
- OpenAI exige que les outils soient définis via des objets de schéma JSON structurés;
- Anthropic (Claude) s'attend à des invites encadrées par des balises de type XML;
- Google Gemini utilise ses propres structures et kits de développement spécifiques (SDK).

En raison de cette fragmentation, un outil qui fonctionne parfaitement dans l'écosystème d'un modèle est totalement inutilisable avec un autre sans une réécriture complète de son interface. 

### Qu'est-ce que le MCP ?

### Comment fonctionne le MCP ?

### Conclusion : Les bénéfices stratégiques et l'Avenir

### Étape suivante

### Ressources
