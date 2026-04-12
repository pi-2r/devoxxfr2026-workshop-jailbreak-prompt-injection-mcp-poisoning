

#  Il était une fois dans un monde numérique ...

[<img src="img/step1.jpg" alt="hobbiton" width="800" height="450">](https://www.youtube.com/watch?v=dDKVKG3ESsk)
> "Home is now behind you, the world is ahead!", Gandalf, The Hobbit

## 🎯 Objectifs de cette étape 

- Comprendre les origines des LLM et leur fonctionnement
- Découvrir les concepts de base de l'intelligence artificielle, des réseaux neuronaux et des LLM
- Explorer l'architecture des Transformers et son impact sur le traitement du langage naturel
- Identifier les applications d'IA générative les plus utilisées, notamment les chatbots et les copilotes
- Analyser l'impact des LLM sur la productivité professionnelle


## Sommaire

- [2022 le lancement](#2022-le-lancement)
- [Intelligence Artificielle, réseaux neuronaux et LLM](#intelligence-artificielle-réseaux-neuronaux-et-llm)
- [Les Transformers: origines et architecture](#les-transformers-origines-et-architecture)
  - [Quelques exemples d'applications](#quelques-exemples-dapplications)
- [Les 2 applications d’IA générative les plus utilisées au monde](#les-2-applications-dia-générative-les-plus-utilisées-au-monde)
  - [Les chatbots](#les-chatbots)
    - [Quelques exemples de chatbots](#quelques-exemples-de-chatbots)
  - [Les copilotes](#les-copilotes)
    - [Quelques exemples de copilotes](#quelques-exemples-de-copilotes)
  - [Chatbots vs Copilotes](#chatbots-vs-copilotes)
- [L’impact des LLM sur la productivité professionnelle](#limpact-des-llm-sur-la-productivité-professionnelle)
- [Étape suivante](#étape-suivante)
- [Ressources](#ressources)


## 2022 le lancement

Les LLM (grands modèles linguistiques en français), ont fait leur apparition auprès du grand public lors du lancement 
officiel de ChatGPT, le 30 novembre 2022.
En moins d'une semaine, l'application qui est capable de répondre à tout et à tout le monde, a réussi à attirer ses 
premiers millions d'utilisateurs. Dès lors, en janvier 2023, soit 2 mois après son lancement, ChatGPT a dépassé les 
100 millions d'utilisateurs, devenant de ce fait, la 2ème application numérique à connaître la croissance la plus rapide 
de l'histoire de l'informatique, devançant de loin TikTok, Facebook et Instagram.


<a href="https://www.visualcapitalist.com/threads-100-million-users/" target="_blank">
  <img src="https://www.visualcapitalist.com/wp-content/uploads/2023/07/CP_Threads-Fastest-100-Million.jpg" alt="image" width="450" style="transition:0.3s;">
</a>

<a href="https://www.visualcapitalist.com/threads-100-million-users/" target="_blank"><em>source: visualcapitalist.com</em></a>



Depuis l’apparition de ChatGPT, les modèles de langage (LLM) ont été propulsés sur le devant de la scène auprès du grand
public. Cette exposition a suscité de nombreuses idées reçues, parfois exagérées — comme la crainte que l’intelligence 
artificielle remplace l’humain — ainsi que des inquiétudes concernant la nature des réponses générées, notamment sur la 
facilité supposée d’obtenir des informations sensibles ou dangereuses.

>Pour mieux comprendre la réalité derrière ces idées reçues, il est pertinent de se référer aux interviews et ouvrages 
de Luc Julia, co-créateur de Siri, qui apporte un regard éclairé et nuancé sur les véritables capacités de l’IA. Quant 
aux questions de sécurité et de fiabilité des contenus générés, je vous invite à poursuivre ce codelab pour explorer 
ces enjeux plus en détail.

Par ailleurs, depuis ce lancement, les grandes entreprises technologiques ont intensifié leurs efforts dans la course à 
l’intelligence artificielle, dépassant largement les avancées initiales de ChatGPT.


<a href="https://www.visualcapitalist.com/charted-the-growth-of-big-tech-since-chatgpts-launch/" target="_blank">
  <img src="https://www.visualcapitalist.com/wp-content/uploads/2024/12/Growth-of-Big-Tech-Firms_WEB.jpg" alt="image" width="450" style="transition:0.3s;">
</a>

<a href="https://www.visualcapitalist.com/charted-the-growth-of-big-tech-since-chatgpts-launch/" target="_blank"><em>source: visualcapitalist.com</em></a>


## Intelligence Artificielle, réseaux neuronaux et LLM

Dans les médias, il n'est pas rare de lire différents termes pour parler spécifiquement d'intelligence artificielle.  
Certains utiliseront le terme réseaux neuronaux, d'autres le terme LLM ou tout simplement l'intelligence artificielle; 
cependant ces 3 termes représentent différentes facettes d'un paysage plus vaste d'apprentissage automatique et 
d'intelligence computationnelle. 

Tentons d'appliquer une distinction sur chacun de ces 3 termes:


**IA:**
L’intelligence artificielle, ou intelligence augmentée pour certains, est un domaine qui réunit plusieurs disciplines et 
qui cherche à créer des systèmes capables de réaliser des tâches habituellement réservées aux humains, comme résoudre 
des problèmes, percevoir leur environnement ou comprendre le langage.
L'IA correspond à un large éventail de technologies, de méthodologies et des systèmes basés sur des règles aux 
algorithmes d'apprentissage automatique, servant de terme générique à de multiples approches pour parvenir à l'intelligence artificielle.

**Réseaux Neuronaux:**
Cette partie de l'intelligence artificielle s'inspire du fonctionnement du cerveau humain. Les réseaux neuronaux, 
sont des modèles informatiques conçus pour reconnaître des schémas et d'appliquer des décisions suivant les données 
qu'ils traitent. Ils peuvent parfois être simples (on parlera alors de réseaux neurones superficiels) ou d'autres fois 
complexes (là on dira que ce sont des réseaux neuronaux profonds).
Dans tous les cas, les réseaux neuronaux forment la base essentielle de nombreuses applications contemporaines 
d’intelligence artificielle, telles que la reconnaissance d’images, le traitement automatique du langage naturel et la 
conduite autonome de véhicules.

**LLM:**
Pour faire simple, les LLM (ou grands modèles de langage) sont un type spécifique de réseau neuronal. Ils se basent sur 
des formes avancées de réseaux neurones, comme les modèles transformateurs, pour comprendre et produire du texte à 
partir des données d'entraînement. Leurs forces résident dans la gestion des tâches linguistiques, allant de la simple 
saisie de texte, à la synthèse rédactionnelle d'un document de centaines de pages sans dénaturer l'idée principale.

<img src="https://i0.wp.com/www.phdata.io/wp-content/uploads/2024/10/article-image1-6.png" alt="image" width="450" style="transition:0.3s;">

<a href="https://phdata.io" target="_blank"><em>source: phdata.io</em></a>


## Les Transformers: origines et architecture

Là, on ne va pas parler des films de Michael Bay, mais on va continuer à parler d'IA.

L'architecture du transformateur a été introduite dans un article scientifique intitulé "**Attention is All You Need**",
publié en 2017 par une équipe de Google Brain.

<img src="https://miro.medium.com/v2/resize:fit:1400/format:webp/0*jKqypwGzmDv7KDUZ.png" alt="image" width="450" style="transition:0.3s;">

<a href="https://medium.com" target="_blank"><em>source: medium.com</em></a>

 

L'article présentait une approche innovante pour les tâches de 
traitement automatique du langage naturel (**TALN**), en faisant le choix de s’éloigner des modèles traditionnels qui 
reposaient principalement sur les réseaux neuronaux récurrents (**RNN**) et convolutifs (**CNN**).

Le **transformateur** a apporté une avancée majeure : **le mécanisme d’auto-attention**.

Grâce à ce procédé, le modèle peut 
déterminer l’importance relative de chaque mot dans une phrase, ce qui améliore considérablement sa compréhension du 
contexte (et c'est où se trouve l'angle de l'attaque par prompt injection).


Il faut comprendre qu'avant l’arrivée des transformateurs, **les réseaux neuronaux traditionnels** comme les **RNN** et 
les **CNN** montraient des limites importantes dans la compréhension du langage naturel, principalement à cause de 
leur difficulté à saisir le contexte sur de longues séquences. Incapables d’appréhender l’ensemble d’un texte, ils 
peinaient à restituer le sens global et les nuances. 

L’architecture du Transformer a comblé cette lacune, révolutionnant ainsi le traitement du langage par l’IA.


Dès lors, l’architecture Transformer a représenté un véritable tournant dans l’IA. 
D’abord conçue pour la compréhension et la génération de texte, elle s’est rapidement révélée efficace dans de 
nombreux autres domaines, dépassant largement les attentes initiales des chercheurs et ingénieurs !

### Quelques exemples d'applications

Voici quelques exemples d'applications de l'architecture Transformer :

| Domaine                       | Applications clés                                                          | Impact principal                                                    |
|-------------------------------|----------------------------------------------------------------------------|---------------------------------------------------------------------|
| Traitement du langage naturel | Traduction, synthèse, questions-réponses, analyse des sentiments           | Nouvelles performances de référence, parfois supérieures à l’humain |
| Vision par ordinateur         | Classification d’images, détection d’objets, segmentation (ViT)            | Performances compétitives, voire meilleures que les CNN             |
| Reconnaissance vocale         | Compréhension du langage parlé, modèles hybrides (conformateur)            | Nouvelles normes en reconnaissance vocale                           |
| Systèmes autonomes            | Véhicules autonomes, compréhension contextuelle                            | Pilote l’intelligence des voitures sans conducteur                  |
| Santé                         | Découverte de médicaments, analyse d’images médicales, diagnostics         | Accélère la recherche et améliore la précision des diagnostics      |



## Les 2 applications d’IA générative les plus utilisées au monde

Au-delà des exemples décrits ci-dessus, nous allons nous pencher sur 2 types d'applications d'IA qui sont basées sur les LLM, à savoir les chatbots et les copilotes.

### Les chatbots

Les chatbots sont des logiciels conçus pour dialoguer avec les utilisateurs de manière naturelle. Ils sont très largement 
utilisés dans les services client pour répondre aux questions et accompagner les clients, mais aussi dans des domaines 
variés comme les jeux vidéo, ou dans des narrations interactives.

#### Quelques exemples de chatbots

| Entreprise            | Fonction principale du chatbot                                    | Lien vers le chatbot                                                                                             |
|-----------------------|-------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------|
| SNCF Connect & Tech   | Répond aux questions des clients concernant la FAQ ou la G30      | [https://www.sncf-connect.com/bot](https://www.sncf-connect.com/bot)                                             |
| Sephora               | Conseille les clients sur les produits adaptés à leur peau        | [https://www.messenger.com/t/sephorafrance](https://www.messenger.com/t/sephorafrance)                           |
| H&M                   | Aide à trouver vêtements et accessoires selon le style            | [https://www2.hm.com/fr_fr/service-clients/contact.html](https://www2.hm.com/fr_fr/service-clients/contact.html) |
| KLM                   | Répond aux questions sur les vols                                 | [https://www.messenger.com/t/331735092583](https://www.messenger.com/t/331735092583)                             |


### Les copilotes

Les copilotes sont des logiciels conçus pour aider à la rédaction, au codage et à la recherche. Ils génèrent des idées, détectent
les erreurs et optimisent le travail des utilisateurs.

Bien qu’encore en développement, ils pourraient transformer nos méthodes de travail et d’apprentissage.

#### Quelques exemples de copilotes

| Outils / Services                                      | Fonction principale                                                      |
|--------------------------------------------------------|--------------------------------------------------------------------------|
| Grammarly, ProWritingAid                               | Améliorent la rédaction : correction, style, retours personnalisés       |
| GitHub Copilot, Gemini Code Assist, AWS CodeWhisperer  | Aident à coder : suggestions, traduction, détection d’erreurs            |
| Copilot for Microsoft 365, Gemini for Google Workspace | Optimisent la productivité et la créativité dans les suites bureautiques |



### Chatbots vs Copilotes
Voici un tableau comparatif entre les chatbots et les copilotes, mettant en évidence leurs différences et similitudes :


| Aspect                | Chatbots                                 | Copilots                                     | Similarités                                      |
|-----------------------|------------------------------------------|----------------------------------------------|--------------------------------------------------|
| Technologie           | Basés sur des LLM                        | Basés sur des LLM                            | Génèrent du texte, assistent les utilisateurs    |
| Fonction principale   | Simulent une conversation                | Aident à accomplir des tâches spécifiques    |                                                  |
| Usage courant         | Service client, interaction              | Rédaction, codage, recherche                 |                                                  |
| Interactivité         | Très interactifs                         | Plus axés sur l’exécution de tâches          |                                                  |



## L’impact des LLM sur la productivité professionnelle

<a href="https://www.visualcapitalist.com/charted-productivity-gains-from-using-ai/" target="_blank">
  <img src="https://www.visualcapitalist.com/wp-content/uploads/2025/06/Human-vs-AI-Site.png" alt="image" width="450" style="transition:0.3s;">
</a>

<a href="https://www.visualcapitalist.com/charted-productivity-gains-from-using-ai/" target="_blank"><em>source: visualcapitalist.com</em></a>


L’efficacité des modèles de langage de grande taille (LLM) dans les applications d’IA générative est aujourd’hui largement reconnue. À mesure que ces outils s’intègrent, voire deviennent incontournables, dans les environnements professionnels, leur influence sur la productivité se confirme de façon tangible.

- L’intégration de l’IA générative dans les processus de travail a permis de réduire de plus de 60% le temps moyen nécessaire à l’accomplissement de diverses tâches.
- Contrairement à l’idée reçue selon laquelle l’IA remplacerait le travail humain, les données montrent que les professionnels équipés d’outils d’IA accomplissent leurs missions de manière nettement plus efficace.

Exemples concrets d’amélioration :

- Pour la rédaction de contenus, le temps moyen est passé de 80 minutes à seulement 25 minutes grâce à l’IA générative.
- Sur des tâches cognitives complexes telles que les mathématiques, l’analyse de systèmes ou les opérations, l’IA permet de gagner plus d’une heure par tâche.

En somme, l’IA générative ne se limite pas à l’automatisation de tâches : elle décuple l’efficacité des professionnels 
en leur ouvrant l’accès à des niveaux de productivité inégalés. Cette avancée s’explique notamment par le fait que 
certains modèles récents, comme le dernier modèle OpenAI o3, affichent des capacités de raisonnement équivalentes, 
voire supérieures, à celles d’un individu doté d’un QI supérieur à 130.

<details>
  <summary>Consulter la typologie des niveaux d’intelligence des modèles.</summary>

<a href="https://www.visualcapitalist.com/ranked-the-smartest-ai-models-by-iq/" target="_blank">
  <img src="https://www.visualcapitalist.com/wp-content/uploads/2025/06/IQ-of-AI_02-web.jpg" alt="image" width="450" style="transition:0.3s;">
</a>

<a href="https://www.visualcapitalist.com/ranked-the-smartest-ai-models-by-iq/" target="_blank"><em>source: visualcapitalist.com</em></a>
</details>


## Étape suivante

- [Étape 2](step_2.md)


## Ressources


| Information                                                                    | Lien                                                                                                                                                                                                                                       |
|--------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Les 7 étapes de l'apprentissage automatique                                    | [https://www.youtube.com/watch?v=nKW8Ndu7Mjw](https://www.youtube.com/watch?v=nKW8Ndu7Mjw)                                                                                                                                                 |
| LLM Engineer's Handbook                                                        | [https://www.packtpub.com/en-fr/product/llm-engineers-handbook-9781836200062](https://www.packtpub.com/en-fr/product/llm-engineers-handbook-9781836200062)                                                                                 |
| AI Engineering                                                                 | [https://www.oreilly.com/library/view/ai-engineering/9781098166298/](https://www.oreilly.com/library/view/ai-engineering/9781098166298/)                                                                                                   |
| Generative AI for Software Development                                         | [https://learning.oreilly.com/library/view/generative-ai-for/9781098162269](https://learning.oreilly.com/library/view/generative-ai-for/9781098162269)                                                                                     |
| Developer’s Playbook for Large Language Model Security                         | [https://www.oreilly.com/library/view/the-developers-playbook/9781098162191/](https://www.oreilly.com/library/view/the-developers-playbook/9781098162191/)                                                                                 |
| How AI Works: From Sorcery to Science                                          | [https://www.amazon.com/How-AI-Works-Sorcery-Science/dp/1718503725](https://www.amazon.com/How-AI-Works-Sorcery-Science/dp/1718503725)                                                                                                     |                                                                                                      
| AI, Machine learning, Neural Networks, Deep Learning Concept List w/samples    | [https://medium.com/@anixlynch/ai-machine-learning-neural-networks-deep-learning-concept-list-w-samples-28ac4d67eb65](https://medium.com/@anixlynch/ai-machine-learning-neural-networks-deep-learning-concept-list-w-samples-28ac4d67eb65) |
| L’Intelligence Artificielle n’existe pas - Luc Julia                           | [https://youtu.be/JdxjGZBtp_k?si=kNrcqC4snFPksmei](https://youtu.be/JdxjGZBtp_k?si=kNrcqC4snFPksmei)                                                                                                                                       |
| Attention Is All You Need                                                      | [https://arxiv.org/abs/1706.03762](https://arxiv.org/abs/1706.03762)                                                                                                                                                                       |
| TALN                                                                           | [https://fr.wikipedia.org/wiki/Traitement_automatique_des_langues](https://fr.wikipedia.org/wiki/Traitement_automatique_des_langues)                                                                                                       |
| RNN                                                                            | [https://fr.wikipedia.org/wiki/R%C3%A9seau_de_neurones_r%C3%A9currents](https://fr.wikipedia.org/wiki/R%C3%A9seau_de_neurones_r%C3%A9currents)                                                                                             |
| CNN                                                                            | [https://fr.wikipedia.org/wiki/R%C3%A9seau_neuronal_convolutif](https://fr.wikipedia.org/wiki/R%C3%A9seau_neuronal_convolutif)                                                                                                             |
| Intelligence artificielle générative : de quoi parle-t-on ?                    | [https://bigmedia.bpifrance.fr/news/intelligence-artificielle-generative-de-quoi-parle-t](https://bigmedia.bpifrance.fr/news/intelligence-artificielle-generative-de-quoi-parle-t)                                                         |
| Fonctionnement de l’IA générative et des LLM                                   | [https://learn.microsoft.com/fr-fr/dotnet/ai/conceptual/how-genai-and-llms-work](https://learn.microsoft.com/fr-fr/dotnet/ai/conceptual/how-genai-and-llms-work)                                                                           |
| LLM vs. Chatbot : Quelle solution pour quels besoins ?                         | [https://www.hubi.ai/blogfr/llm-vs-chatbot/](https://www.hubi.ai/blogfr/llm-vs-chatbot/)                                                                                                                                                   |
| Sephora et son chatbot Ora                                                     | [https://www.viseo.com/fr/secteurs-activites/sephora-choisit-viseo-pour-la-creation-de-son-chatbot-ora/](https://www.viseo.com/fr/secteurs-activites/sephora-choisit-viseo-pour-la-creation-de-son-chatbot-ora/)                           |
| Comment fonctionne le bot H&M                                                  | [https://redresscompliance.com/how-hm-uses-ai-powered-chatbots-to-improve-customer-service/](https://redresscompliance.com/how-hm-uses-ai-powered-chatbots-to-improve-customer-service/)                                                   |
| KLM et leur chatbot BlueBot                                                    | [https://news.klm.com/klm-welcomes-bluebot-bb-to-its-service-family/](https://news.klm.com/klm-welcomes-bluebot-bb-to-its-service-family/)                                                                                                 |
| Entreprises qui utilisent des chatbots                                         | [https://www.chatbotguide.org/](https://www.chatbotguide.org/)                                                                                                                                                                             |
| Dans les coulisses de Copilot : Contexte + LLM + perf + sécurité = ✨           | [https://www.youtube.com/watch?v=-oyZsPCpK-Q](https://www.youtube.com/watch?v=-oyZsPCpK-Q)                                                                                                                                                 |
| Les défis éthiques de la recherche assistée par l’IA en économie et gestion    | [https://knowledge.essec.edu/fr/economy-finance/defis-ethiques-recherche-intelligence-artificielle.html](https://knowledge.essec.edu/fr/economy-finance/defis-ethiques-recherche-intelligence-artificielle.html)                           |
