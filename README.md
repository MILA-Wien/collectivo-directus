# Collectivo2

An experimental setup for Collectivo based on [Directus](https://directus.io/), [Keycloak](https://www.keycloak.org/), and [Nuxt](https://nuxtjs.org/).

## Overview

Collectivo is a set of modular [Nuxt Layers](https://nuxt.com/docs/guide/going-further/layers) that can be added to a [Nuxt App](https://nuxt.com/) and easily be combined with custom code for each project.

The core functionalities of Collectivo include authentication with a keycloak server, connection to a directus database, a migration system, a dashboard, and a basic database structure.

Extension modules can import code from collectivo as well as from each other (circular dependencies are not possible).

## Structure

- collectivo (Nuxt)
    - dev_app - An application of Collectivo for development
    - collectivo - Core functionalities
    - extensions - Optional modules
- directus - Database, API & Admin app
- keycloak - Authentication server

## Development

Install the following requirements:

- [Docker](https://docs.docker.com/get-docker/)
- [pnpm](https://pnpm.io/installation)

Start a development system with:

```
cp .env.example .env
docker compose build
docker compose up -d
pnpm install
pnpm dev
```

This creates a docker container for Directus and Keycloak, and then starts a development server for the Collectivo app.

Available services:

- Collectivo: http://localhost:3000/
    - Tailwind: http://localhost:3000/_tailwind/
- Directus: http://localhost:8055/
- Keycloak: http://localhost:8080/

Collectivo API for migrations (requires API token in authentication header)

- `/api/migrate/all` - Migrate all extensions
    - `?demo=true` adds demo data
- `/api/migrate/?ext=extensionName` - Migrate a specific extension
    - `?to=1` run migrations up or down towards a specific version
- `/api/migrate/force/?ext=extensionName&id=1` - Migrate a specific migration

Tips:
- If directus cannot write to the database, try `sudo chmod -R 777 directus/database`
- To reset the database, run
    - `docker volume rm collectivo_directus-db-data`
    - `docker compose restart directus directus-cache directus-db`

- Udate dependencies `pnpm update -r -L`
- Publish all packages (remove --dry-run) `pnpm publish -r --access=public --dry-run`
- To run unit tests, use: `pnpm test`

## Extensions

- Create a new [Nuxt Layer](https://nuxt.com/docs/guide/going-further/layers)
- Register the extension in `my-extension/server/plugins/registerExtension.ts`
- Add the extension to `package.json` and `nuxt.config.ts` of your app
- All collections and fields should start with `extensionName_` to avoid name conflicts.
