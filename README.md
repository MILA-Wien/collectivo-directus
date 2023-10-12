# Collectivo2

An experimental setup for Collectivo based on [Nuxt Layers](https://nuxt.com/docs/guide/going-further/layers), [Directus](https://directus.io/), and [Keycloak](https://www.keycloak.org/).

## Structure

- collectivo - Frontend & API
    - dev_app - Example application
    - collectivo - Core functionalities
    - extensions - Optional modules
- directus - Database, API, & Admin app
- keycloak - Authentication

## Development

### Installation

Install the following requirements:

- [Docker](https://docs.docker.com/get-docker/)
- [pnpm](https://pnpm.io/installation)

Add the following to your `etc/hosts` file:

```
127.0.0.1 keycloak
```

Prepare the environment:

```
cp .env.example .env
docker compose up -d keycloak
pnpm install
```

Wait for keycloak to be ready, then run:

```
docker compose up -d
pnpm dev
```

The following services should now be available:

- Collectivo/Nuxt: http://localhost:3000/
- Directus: http://localhost:8055/
- Keycloak: http://localhost:8080/

Then run migrations & create example data as follows, run:

```
curl \
  --header "Authorization: badToken" \
  --request POST \
  http://localhost:3000/api/migrate/all/?demo=true
```

You can then log in with the following example users:

- Admin: admin@example.com / admin
- Editor: editor@example.com / editor
- User: user@example.com / user

### Migrations

Migrations can be run via the API, using the NUXT_API_TOKEN.

Endpoints:

- `/api/migrate/all` - Migrate all extensions
    - `?demo=true` adds demo data
- `/api/migrate/?ext=extensionName` - Migrate a specific extension
    - `?to=1` run migrations up or down towards a specific version
- `/api/migrate/force/?ext=extensionName&id=1` - Migrate a specific migration

### Unit testing

- To run unit tests, use: `pnpm test`

### Troubleshooting

- If directus cannot write to the database, try `sudo chmod -R 777 directus/database`
- To reset the database, run
    - `docker volume rm collectivo_directus-db-data`
    - `docker compose restart directus directus-cache directus-db`

- Udate dependencies `pnpm update -r -L`
- Publish all packages (remove --dry-run) `pnpm publish -r --access=public --dry-run`

### Creating a new extension

- Create a new [Nuxt Layer](https://nuxt.com/docs/guide/going-further/layers)
- Register the extension in `my-extension/server/plugins/registerExtension.ts`
- Add the extension to `package.json` and `nuxt.config.ts` of your app
- All collections and fields should start with `extensionName_` to avoid name conflicts.
