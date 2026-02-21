.PHONY: build up dev down logs restart clean

# Construire l'image docker
build:
	docker-compose build

# Démarrer l'environnement en arrière-plan
up:
	docker-compose up -d

# Démarrer l'environnement avec les logs attachés
dev:
	docker-compose up

# Arrêter l'environnement
down:
	docker-compose down

# Afficher les logs
logs:
	docker-compose logs -f

# Redémarrer l'environnement
restart: down up

# Nettoyer les conteneurs, volumes et réseaux
clean:
	docker-compose down -v --remove-orphans
