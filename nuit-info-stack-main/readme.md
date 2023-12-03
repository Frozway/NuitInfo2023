<h1>Stack de développement Symfony de la SAE3</h1>

--- 
Contenu : 
- [Prérequis](#prérequis)
- [Démarrage](#démarrage)
  - [1. Lancer la stack du projet](#3-démarrer-la-stack-du-projet)

--- 

## Prérequis

Sur votre machine Linux ou Mac :

- Docker 24 
- Docker Engine sous Linux (ne pas installer Docker Desktop sous Linux)
- Docker Desktop sous Mac
- PHPStorm  
  _Votre email étudiant vous permet de bénéficier d'une licence complète de 12 mois pour tous les produits JetBrains_  

De manière optionnelle, mais fortement recommandée :

- Une [clé SSH](https://forge.iut-larochelle.fr/help/ssh/index#generate-an-ssh-key-pair) active sur votre machine
  (perso) et [ajoutée dans votre compte gitlab](https://forge.iut-larochelle.fr/help/ssh/index#add-an-ssh-key-to-your-gitlab-account) :  
  elle vous permettra de ne pas taper votre mot de passe en permanence.

## Démarrage

### 1. Lancer la stack du projet 

Dans un terminal positionné dans le dossier de la stack du projet : 

- Démarrer la stack    
```
docker compose up --build -d
```

- Inspecter l'état des services 
```
docker compose ps
```
Dans un terminal positionné dans le dossier de la stack du projet : 
 
 - On se connecte au conteneur associé su service `sfapp` 
```bash
docker compose exec sfapp bash
```

- Vérifier l'exécution du service `sfapp`
```
localhost:8000
```
