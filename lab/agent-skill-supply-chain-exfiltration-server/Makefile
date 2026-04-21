.PHONY: build up dev down logs restart clean

ROOT     := $(shell git rev-parse --show-toplevel)
ENV_FILE := $(ROOT)/.env.local
ENV_ARGS := $(if $(wildcard $(ENV_FILE)),--env-file $(ENV_FILE),)

# Construire l'image docker
build:
	docker compose $(ENV_ARGS) build

# Démarrer l'environnement en arrière-plan
up:
	docker compose $(ENV_ARGS) up --build -d

# Démarrer l'environnement avec les logs attachés
dev:
	docker compose $(ENV_ARGS) up --build

# Arrêter l'environnement
down:
	docker compose down

# Afficher les logs
logs:
	docker compose logs -f

# Redémarrer l'environnement
restart: down up

# Nettoyer les conteneurs, volumes et réseaux
clean:
	docker compose down -v --remove-orphans
