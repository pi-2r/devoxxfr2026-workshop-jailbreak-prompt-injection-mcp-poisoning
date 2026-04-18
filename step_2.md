#  Pourquoi la sécurité des LLM est-elle cruciale ?

[<img src="img/step2.png" alt="gandalf" >](https://www.youtube.com/watch?v=whF2na8AIbw)
> "The year 3434 of the Second Age. Here follows the account of Isildur, High King of Gondor, and the finding of the ring 
> of power. It has come to me. The One Ring", Gandalf, LOTR - The Fellowship of the Ring

## 🎯 Objectifs de cette étape

- Avoir une vue d'ensemble sur la nouvelle ère technologique de l'IA générative.
- Comprendre l'importance de la sécurité des LLM dans le contexte de l'IA générative.

## Sommaire

- [L'émergence de l'IA, une nouvelle ère technologique](#lémergence-de-lia-une-nouvelle-ère-technologique)
- [Le LLM, un cerveau connecté à vos programmes](#le-llm-un-cerveau-connecté-à-vos-programmes)
- [Les différents points de contrôle](#les-différents-points-de-contrôle)
  - [Interaction avec l'utilisateur](#interaction-avec-lutilisateur)
  - [Données d'entraînement publiques](#données-dentraînement-publiques)
  - [Données d'entraînement interne](#données-dentraînement-interne)
  - [Services internes](#services-internes)
  - [Accès aux données publiques](#accès-aux-données-publiques)

- [Le modèle LLM](#le-modèle-llm)
  - [Modèle par API](#modèle-par-api)
  - [Modèle hébergé](#modèle-hébergé)


- [Étape suivante](#étape-suivante)
- [Ressources](#ressources)

## L'émergence de l'IA, une nouvelle ère technologique

L’essor fulgurant de l’intelligence artificielle, porté notamment par ChatGPT, a propulsé cette technologie sur le 
devant de la scène. Son adoption massive ne se limite plus au grand public: les entreprises, séduites par l’efficacité 
des grands modèles de langage (LLM) dans les applications d’IA générative, en font désormais un levier incontournable 
de productivité.


<a href="https://www.visualcapitalist.com/charted-top-10-companies-leading-the-new-era-of-ai/" target="_blank">
  <img src="https://www.visualcapitalist.com/wp-content/uploads/2025/06/Companies-Leading-the-New-Era-of-AI_WEB-1.jpg" alt="image" width="450" style="transition:0.3s;">
</a>

<a href="https://www.visualcapitalist.com/charted-top-10-companies-leading-the-new-era-of-ai/" target="_blank"><em>source: visualcapitalist.com</em></a>


Cependant, cette popularité s’accompagne de nouveaux enjeux majeurs en matière de sécurité. Les LLM introduisent des 
risques spécifiques, différents des menaces cyber classiques telles que les attaques DDoS, les injections SQL/XSS ou 
les ransomwares. Leurs capacités à interpréter et générer du langage naturel via des prompts ouvrent la voie à des 
vulnérabilités inédites : manipulation des requêtes, génération de contenus malveillants ou inappropriés, exfiltration 
d’informations sensibles, ou encore actions non prévues par les concepteurs du système. Voyons cela plus en détail.


# Le LLM, un cerveau connecté à vos programmes

Les développeurs, tout comme les entreprises qui les emploient, perçoivent fréquemment les grands modèles de langage (LLM)
comme des systèmes autonomes, capables d’exploits remarquables en matière de compréhension et de génération de contenus. 
Pourtant, dans la réalité de l’ingénierie logicielle, les LLM ne fonctionnent que rarement de manière isolée : 
ils s’intègrent généralement au cœur d’architectures décisionnelles complexes, conçues pour accroître l’autonomie des applications.

Ces architectures reposent sur l’interconnexion de multiples composants, chacun jouant un rôle spécifique dans la chaîne
de traitement. Cette organisation modulaire est essentielle pour garantir la cohérence, la robustesse et la performance 
globale des solutions basées sur l’IA générative. Ainsi, le LLM agit comme un maillon central, mais il dépend étroitement
de l’ensemble du système pour délivrer des résultats fiables et pertinents. Il est donc essentiel d’avoir une vision 
d’ensemble de l’architecture qui entoure le LLM déployé.

Le schéma ci-dessous présente une version simplifiée de l’intégration d’un LLM dans un environnement d’entreprise.

Pour les interactions avec des services, API ou bases de données, le protocole MCP a émergé comme un standard — nous 
l'évoquerons en détail et l'utiliserons dans la suite de ce codelab.


 <img src="img/llm-inside.png" alt="llm-inside" width="450" style="transition:0.3s;">

En soi, la démarche reste relativement simple. Cependant, il est indispensable de mettre en place des points de contrôle
sur les connexions auxquelles le LLM a accès. Ces contrôles peuvent prendre différentes formes, telles que l’authentification, 
la validation des données ou encore la gestion des autorisations d’accès.

Le schéma ci-dessous propose une vue simplifiée des principaux points de contrôle à considérer.

 <img src="img/llm-inside-secure.png" alt="llm-inside" width="450" style="transition:0.3s;">

## Les différents points de contrôle

### Interaction avec l'utilisateur
Il est important de considérer que les utilisateurs peuvent, intentionnellement ou non, introduire des erreurs. Il est 
donc essentiel de mettre en place des dispositifs visant à protéger le modèle LLM contre des entrées potentiellement 
contradictoires ou trompeuses, qu’elles proviennent des utilisateurs ou d’autres systèmes. Une vigilance particulière 
doit également être accordée aux contenus toxiques, inexacts ou sensibles que le modèle pourrait générer et transmettre 
à l’utilisateur.
<details>
  <summary>Exemple</summary>
<a href="https://twitter.com/MathisHammel/status/1600413492636307456?s=20&t=fPcFwvq05Oe8JHkvVi95xw" target="_blank">
  <img src="https://pbs.twimg.com/media/FjXOpGiWYAAG-9r?format=jpg&name=small" alt="image" width="450" style="transition:0.3s;">
</a>

<a href="https://twitter.com/MathisHammel/status/1600413492636307456?s=20&t=fPcFwvq05Oe8JHkvVi95xw" target="_blank">
<em>source: twitter.com</em></a>
</details>

### Données d'entraînement publiques
Les LLM sont généralement entraînés à partir d’immenses ensembles de données issues d’Internet. Il est donc essentiel de 
considérer ces sources comme potentiellement peu fiables et de rester vigilant face aux risques de toxicité, de biais 
ou d’empoisonnement des données provenant d’informations contradictoires. Exemple Grok avec son modèle issu de la 
plateforme X (anciennement Twitter) qui se base essentiellement sur les commentaires (trolls ?) des utilisateurs.
<details>
  <summary>Exemple</summary>
<a href="https://bsky.app/profile/epyon.bsky.social/post/3ltcxxxv22s2k" target="_blank">
  <img src="https://cdn.bsky.app/img/feed_thumbnail/plain/did:plc:ltgm2ysjnysy4hnpxjdwuwn3/bafkreicd5bm65vhtvn47ykkzfnzrunqyqjgsu6whkcgdaowhacspg2gzzm@jpeg" alt="image" width="450" style="transition:0.3s;">
</a>

<a href="https://bsky.app/profile/epyon.bsky.social/post/3ltcxxxv22s2k" target="_blank"><em>source: bsky.app</em></a>
</details>

### Données d'entraînement interne

Il est possible d’utiliser des données internes pour optimiser le modèle, ce qui peut sensiblement accroître sa précision. 
Toutefois, il est impératif de s’assurer que les informations sensibles, confidentielles ou à caractère personnel ne 
soient ni intégrées ni exposées lors de ce processus.

<details>
  <summary>Exemple</summary>
<a href="https://neuraltrust.ai/fr/blog/ai-model-data-leakage-prevention" target="_blank">
  <img src="https://a.storyblok.com/f/322249/900x507/4a8eae1fdb/why-your-ai-model-might-be-leaking-sensitive-data-and-how-to-stop-it.png" alt="image" width="450" style="transition:0.3s;">
</a>

<a href="https://neuraltrust.ai/fr/blog/ai-model-data-leakage-prevention" target="_blank"><em>source: neuraltrust.ai</em></a>
</details>

### Services internes
Il est indispensable de maîtriser la manière dont le LLM interagit avec les services connectés de l’entreprise, tels 
que les bases de données ou les API, afin de prévenir toute interaction non autorisée ou fuite de données, comme des 
injections SQL ou des requêtes abusives sur les API.
<details>
  <summary>Exemple</summary>

<a href="https://snyk.io/fr/articles/llm-weaponized-via-prompt-injection-to-generate-sql-injection-payloads/" target="_blank">
  <img src="img/sql-injection-llm.png" alt="image" width="450" style="transition:0.3s;">
</a>

<a href="https://snyk.io/fr/articles/llm-weaponized-via-prompt-injection-to-generate-sql-injection-payloads/" target="_blank"><em>source: snyk.io</em></a>
</details>


### Accès aux données publiques
L’extraction de données en temps réel depuis le Web, notamment par le biais de techniques de scraping, peut constituer 
un levier efficace pour enrichir les fonctionnalités de votre application. Toutefois, il est essentiel de considérer 
ces informations comme potentiellement peu fiables et de rester attentif à des risques tels que l’injection indirecte 
d’invites. Cette vigilance doit être renforcée si vous permettez aux utilisateurs de proposer des sites web à explorer 
ou de téléverser des documents susceptibles d’être compromis.
<details>
  <summary>Exemple</summary>
<a href="https://arxiv.org/html/2505.22998v1" target="_blank">
  <img src="img/arxiv-faill-injection.png" alt="image" width="450" style="transition:0.3s;">
</a>

<a href="https://arxiv.org/html/2505.22998v1" target="_blank"><em>source: arxiv.org</em></a>
</details>

# Le modèle LLM

Le modèle de langage constitue le cœur de toute application basée sur un LLM. Il joue un rôle central en collectant et 
en interprétant les informations afin de permettre l’exécution d’actions au sein d’un environnement informatique.

Selon la configuration de votre infrastructure et vos besoins spécifiques, deux options s’offrent à vous pour permettre 
à votre écosystème d’interagir avec le modèle :
- **Modèle par API** : Par le biais d’une API publique, hébergée par un prestataire externe (ex. OpenAI, Google, Amazon 
    Bedrock, etc.), qui permet d’accéder à un modèle pré-entraîné et de l’utiliser pour générer des réponses ou des actions.


- **Modèle hébergé** : En déployant un modèle hébergé localement, au sein de vos propres installations (on-premises) ou 
    dans le cloud, ce qui vous permet de contrôler entièrement le modèle et de l’adapter à vos besoins spécifiques.


## Modèle par API

Recourir à des API publiques pour se connecter à un ou plusieurs modèles présente l’avantage d’une grande simplicité 
d’utilisation et de coûts généralement plus faibles. De plus, la gestion et la mise à jour des modèles sont assurées 
par le fournisseur du service, ce qui allège considérablement la charge de maintenance pour l’entreprise
utilisatrice (on parle généralement d'un changement de nom de modèle à faire dans le code de votre application).

**Cependant, ce choix implique un compromis important :** le risque d’exposition de données sensibles transmises via l’API. 
En effet, chaque requête envoyée à un modèle tiers franchit la frontière de votre environnement sécurisé pour être 
traitée par un système externe. De plus, bon nombre de fournisseurs ne sont pas toujours très clairs sur la résidence 
des données (*data residency*) et la localité de leur traitement. Des endpoints régionalisés sont souvent évoqués, alors que l'inférence du LLM a lieu dans une autre région — souvent aux États-Unis pour les versions récentes des modèles. Il est donc important d'étudier finement les contrats.

> Ce transfert expose potentiellement vos informations à des problèmes de confidentialité et, selon le niveau de sécurité 
appliqué par le prestataire, cela peut accroître la vulnérabilité face à d’éventuelles violations de données.

## Modèle hébergé
Opter pour l’hébergement privé d’un modèle, en particulier dans des secteurs sensibles comme la banque ou la santé, 
offre un contrôle accru sur vos données et permet de mettre en place des barrières de sécurité clairement définies. 
Cette solution facilite également l’adaptation du modèle aux spécificités de votre domaine d’activité.

**Cependant, ce choix implique un compromis important:** héberger le modèle en interne implique que vous êtes responsable 
de sa maintenance, de ses mises à jour et de la gestion des vulnérabilités potentielles. L'hébergement d'un modèle pour 
des cas d'utilisation qui nécessitent des taux d'appels importants implique de déployer plusieurs nœuds GPU — les coûts 
peuvent alors vite devenir très élevés.

>Si vous choisissez un modèle open source, il devient essentiel de veiller 
à sa fiabilité et à son intégrité afin de prévenir tout risque de faille de sécurité ou de biais intégré.

## Étape suivante

- [Étape 3](step_3.md)


## Ressources


| Information                                                                                         | Lien                                                                                                                                                                                                                                                                                                                               |
|-----------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| How AI can move from hype to global solutions                                                       | [https://www.weforum.org/stories/2025/01/ai-transformation-industries-responsible-innovation/](https://www.weforum.org/stories/2025/01/ai-transformation-industries-responsible-innovation/)                                                                                                                                       |
| ChatGPT séduit les pros : 32 % des entreprises US utilisent OpenAI, loin devant Google et Anthropic | [https://siecledigital.fr/2025/05/12/chatgpt-seduit-les-pros-32-des-entreprises-us-utilisent-openai-loin-devant-google-et-anthropic/](https://siecledigital.fr/2025/05/12/chatgpt-seduit-les-pros-32-des-entreprises-us-utilisent-openai-loin-devant-google-et-anthropic/)                                                         |
| Large language models : les nouveaux enjeux à venir dans la cybersécurité                           | [https://www.journaldunet.com/intelligence-artificielle/1542135-large-language-models-les-nouveaux-enjeux-a-venir-dans-la-cybersecurite/](https://www.journaldunet.com/intelligence-artificielle/1542135-large-language-models-les-nouveaux-enjeux-a-venir-dans-la-cybersecurite/)                                                 |
| Vulnérabilités LLM et sécurité des IA génératives                                                   | [https://www.vaadata.com/blog/fr/vulnerabilites-llm-et-securite-des-ia-generatives/](https://www.vaadata.com/blog/fr/vulnerabilites-llm-et-securite-des-ia-generatives/)                                                                                                                                                           |
| L'IA en cybersécurité : comprendre les risques                                                      | [https://www.malwarebytes.com/fr/cybersecurity/basics/risks-of-ai-in-cyber-security](https://www.malwarebytes.com/fr/cybersecurity/basics/risks-of-ai-in-cyber-security)                                                                                                                                                           | 
| Pièges des LLM                                                                                      | [https://learnprompting.org/fr/docs/basics/pitfalls](https://learnprompting.org/fr/docs/basics/pitfalls)                                                                                                                                                                                                                           | 
| Grok : l’IA d’Elon Musk se fait appeler “MechaHitler”, prône le viol et les théories du complot     | [https://www.lesnumeriques.com/intelligence-artificielle/grok-l-ia-d-elon-musk-se-fait-appeler-mechahitler-prone-le-viol-et-les-theories-du-complot-n239464.html](https://www.lesnumeriques.com/intelligence-artificielle/grok-l-ia-d-elon-musk-se-fait-appeler-mechahitler-prone-le-viol-et-les-theories-du-complot-n239464.html) | 
| LLM en entreprise : allier puissance de l’IA et confidentialité des données                         | [https://www.linkedin.com/pulse/llm-en-entreprise-allier-puissance-de-lia-et-des-donn%C3%A9es-leprince-fkpte/](https://www.linkedin.com/pulse/llm-en-entreprise-allier-puissance-de-lia-et-des-donn%C3%A9es-leprince-fkpte/)                                                                                                       | 

