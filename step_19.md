#  AI Red Teaming

[<img src="img/step15.jpg" alt="gandalf" width="800">](https://www.youtube.com/watch?v=lKSKJZ-XdAk)
> "Fight for us... and regain your honor", Aragorn, LOTR - The Return of the King


## 🎯 Objectifs de cette étape

- Comprendre les principes du red teaming appliqué aux IA génératives
- Identifier les vulnérabilités spécifiques aux systèmes d’IA générative
- Mettre en œuvre des techniques d’attaque et d’évaluation adaptées
- Proposer des stratégies de mitigation et de défense

## Sommaire

- [Red Teaming des intelligences artificielles génératives](#red-teaming-des-intelligences-artificielles-génératives)

- [Approche face aux IA génératives](#approche-face-aux-ia-génératives)
    - [La boîte noire](#la-boîte-noire)
    - [Dépendance aux données](#dépendance-aux-données)
    - [Composants des systèmes d’IA générative](#composants-des-systèmes-dia-générative)

- [Techniques, tactiques et procédures (TTP) spécifiques](#techniques-tactiques-et-procédures-ttp-spécifiques)
- [La recette du succès](#la-recette-du-succès)

- [Étape suivante](#étape-suivante)
- [Ressources](#ressources)

## Red Teaming des intelligences artificielles génératives

Le red teaming des IA génératives ne doit pas se limiter à la recherche de failles techniques isolées au niveau des 
modèles. Il s'agit d'une démarche critique et systématique qui doit couvrir l'ensemble du cycle de vie du système d'IA, 
depuis la conception jusqu'au déploiement et l'exploitation, en tenant compte des interactions complexes entre les 
modèles, les utilisateurs et l'environnement opérationnel.


Cette vision holistique nécessite la constitution d'équipes multifonctionnelles qui combinent compétences techniques, 
socioculturelles, éthiques et légales afin d'identifier les risques émergents, les vulnérabilités systémiques et les 
comportements imprévus qui peuvent survenir dans les environnements réels.


Le red teaming comme exercice de pensée critique dépasse la simple chasse à la faille pour intégrer l'analyse des 
risques sociotechniques, y compris les risques liés aux interactions humaines et aux usages détournés.

## Approche face aux IA génératives

L'approche d’évaluation doit être agile et adaptative, s’appuyant sur une compréhension de l’évolution constante des 
systèmes. Il est essentiel de surveiller et d’intégrer les informations du développement à la production, en incluant 
un contrôle rigoureux et continu des données, de la conception, du code, des environnements d’entraînement, jusqu’aux 
comportements en conditions réelles.

L'évaluation doit être menée à plusieurs niveaux, combinant les tests sur les modèles eux-mêmes (micro-niveau) et sur 
le système global incluant ses interfaces, ses composants techniques et humains (macro-niveau).

### La boîte noire

La nature "boîte noire" des modèles nécessite des approches spécifiques :

- Tester les modèles en boîte noire tout en exploitant, lorsque possible, des versions open source en environnements 
contrôlés pour recréer et comprendre les failles.
- Examiner la conception et l'architecture du système pour identifier les vulnérabilités systémique en amont, notamment 
dans les interfaces, les mécanismes d'observabilité, et les systèmes de gouvernance intégrés dès la conception.

Cela inclut d'anticiper les modes de défaillance liés à des cas extrêmes, des interactions inattendues entre composants, 
ou la manipulation des flux de données.

### Dépendance aux données

La qualité et la gestion des données sont des facteurs cruciaux. Le red teaming doit évaluer toute la chaîne de donnée :

- Collecte, stockage, accès et traçabilité,
- Représentativité et biais des données,
- Protection contre les attaques comme l'empoisonnement de données (data poisoning),
- Risques liés à la dé-anonymisation ou à la combinaison de données apparemment innocentes.

Le contrôle rigoureux des pipelines de données et la prise en compte des évolutions (dérives, biais, attaques) sont 
essentiels.

### Composants des systèmes d’IA générative

Les vulnérabilités doivent être analysées dans l’ensemble des composants critiques :

| Composant   | Description des vulnérabilités spécifiques                                                             |
|-------------|--------------------------------------------------------------------------------------------------------|
| Modèle      | Failles algorithmiques, injections de prompt, erreurs d'optimisation ou biais exploitable.             |
| Données     | Qualité, provenance, biais, attaques par empoisonnement, gestion des accès et vie des données.         |
| Application | Failles classiques de sécurité applicative pouvant être vecteur d'attaque vers le modèle.              |
| Système     | Infrastructures, réseaux, outils de développement, chaînes d’approvisionnement pouvant être compromis. |

Le red teaming doit inclure l'évaluation des environnements de développement, pipelines de déploiement, contrôles 
d'accès et la résilience du système face aux défaillances.

### Techniques, tactiques et procédures (TTP) spécifiques

Outre les TTP classiques issues de la cybersécurité (phishing, exploitation de vulnérabilités, mouvements latéraux, 
exfiltration), les campagnes de red teaming doivent intégrer :

- L'injection et manipulation dans les prompts (red teaming modèle),
- Les attaques sur la chaîne d'approvisionnement des données et des composants,
- Les scénarios d'attaques sociotechniques liées aux comportements utilisateurs et aux interactions humaines,
- La prise en compte des divers contextes culturels, linguistiques et démographiques pour une évaluation exhaustive
et représentative.

### La recette du succès

Le succès du red teaming repose sur une collaboration entre disciplines techniques et non techniques, visant à embrasser
la complexité des systèmes d’IA. Il s'agit de combiner red teaming (identification des risques) avec des méthodes 
complémentaires comme le violet teaming qui combine avec le blue teaming (réponses et remédiations).

La diversité des équipes (compétences, perspectives utilisateur, aspects culturels) est essentielle pour détecter des 
risques invisibles aux approches homogènes.


## Étape suivante

- [Étape 20](step_20.md)


## Ressources

| Information                                                   | Lien                                                                                                                                                                                                     |
|---------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| OWASP GEN AI SECURITY Project Initiatives                     | [https://genai.owasp.org/initiatives/](https://genai.owasp.org/initiatives/)                                                                                                                             |                                                                                                                |
| NVIDIA AI Red Team: An Introduction                           | [https://developer.nvidia.com/blog/nvidia-ai-red-team-an-introduction/](https://developer.nvidia.com/blog/nvidia-ai-red-team-an-introduction/)                                                           |
| Defining LLM Red Teaming                                      | [https://developer.nvidia.com/blog/defining-llm-red-teaming/](https://developer.nvidia.com/blog/defining-llm-red-teaming/)                                                                               |
| Red Teaming AI Red Teaming                                    | [https://arxiv.org/abs/2507.05538](https://arxiv.org/abs/2507.05538)                                                                                                                                     |
| Red Teaming AI: Attacking & Defending Intelligent Systems     | [https://www.amazon.com.au/Red-Teaming-Attacking-Defending-Intelligent-ebook/dp/B0F88SGMXG](https://www.amazon.com.au/Red-Teaming-Attacking-Defending-Intelligent-ebook/dp/B0F88SGMXG)                   |
| SAFE-AI A Framework for Securing AI-Enabled Systems           | [https://www.linkedin.com/feed/update/urn:li:activity:7346561112877821953/](https://www.linkedin.com/feed/update/urn:li:activity:7346561112877821953/)                                                   |
| RedTWIZ: Diverse LLM Red Teaming via Adaptive Attack Planning | [https://arxiv.org/abs/2510.06994](https://arxiv.org/abs/2510.06994)                                                                                                                                     |
| Prompt Injection Taxonomy                                     | [https://github.com/Arcanum-Sec/arc_pi_taxonomy/](https://github.com/Arcanum-Sec/arc_pi_taxonomy/)                                                                                                       |
| OWASP Red Teaming: A Practical Guide to Getting Started       | [https://www.promptfoo.dev/blog/owasp-red-teaming/](https://www.promptfoo.dev/blog/owasp-red-teaming/)                                                                                                   |
| OWASP GenAI Red Teaming Guide                                 | [https://genai.owasp.org/resource/genai-red-teaming-guide/](https://genai.owasp.org/resource/genai-red-teaming-guide/)                                                                                   |                                                                                                                |
| MITRE ATLAS                                                   | [https://atlas.mitre.org/](https://atlas.mitre.org/)                                                                                                                                                     |
