# Collectivo2

An experimental setup for Collectivo based on [Directus](https://directus.io/), [Keycloak](https://www.keycloak.org/), and [Nuxt](https://nuxtjs.org/).

## Overview

Collectivo is a set of modular [Nuxt Layers](https://nuxt.com/docs/guide/going-further/layers) that can be added to a [Nuxt App](https://nuxt.com/) and easily be combined with custom code for each project.

The core module provides the basic functionality for a Collectivo app, including authentication with a keycloak server and connection to a directus database. Extension modules can import code from the core module as well as from each other (although circular dependencies are of course not possible). Database migrations can be defined by each module and are run automatically on startup.

## Structure

- collectivo (Nuxt)
    - app - An application of Collectivo with all modules
    - core - Core functionality
    - extensions - Optional modules
- directus - Database, API & Admin app
- keycloak - Authentication server

## Development

Install the following requirements:

- [Docker](https://docs.docker.com/get-docker/)
- [pnpm](https://pnpm.io/installation)

Start a development system with:

```
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

### Testing

To run unit tests, use:

```
pnpm test
```
