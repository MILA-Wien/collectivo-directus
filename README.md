# Collectivo2

An experimental setup for Collectivo based on [Directus](https://directus.io/), [Keycloak](https://www.keycloak.org/), and [Nuxt](https://nuxtjs.org/).

## Overview

Collectivo is a Nuxt app. All functionality is provided by [modules](https://nuxt.com/docs/guide/concepts/modules). The core module is located in `collectivo/core`.
Additional modules are located in `collectivo/extensions`. Custom modules can be added either locally or as an npm package.

## Structure

- collectivo
    - app - Nuxt app (without content)
    - kit - Utilities for modules
    - core - Module with core functionality
    - extensions - Optional modules
- directus - API & Admin console
- keycloak - Authentication server

## Development

Install the following requirements:

- [Docker](https://docs.docker.com/get-docker/)
- [pnpm](https://pnpm.io/installation)

Start a development system with:

```
pnpm dev
```

This creates a docker container for directus and keycloak, and then starts a development server for collectivo and its extensions.

Available services:

- Collectivo: http://localhost:3000/
    - Tailwind: http://localhost:3000/_tailwind/
- Directus: http://localhost:8055/
- Keycloak: http://localhost:8080/
