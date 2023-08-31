// https://nuxt.com/docs/api/configuration/nuxt-config
import pkg from "./package.json";

export default defineNuxtConfig({
  devtools: { enabled: true },
  runtimeConfig: {
    runMigrations: process.env.COLLECTIVO_RUN_MIGRATIONS == "true" ?? false,
    directusAdminEmail: process.env.DIRECTUS_ADMIN_EMAIL ?? "",
    directusAdminPassword: process.env.DIRECTUS_ADMIN_PASSWORD ?? "",
    public: {
      keycloakUrl: process.env.KEYCLOAK_URL ?? "",
      keycloakRealm: process.env.KEYCLOAK_REALM ?? "",
      keycloakClient: process.env.KEYCLOAK_CLIENT ?? "",
      directusUrl: process.env.DIRECTUS_URL ?? "",
    },
  },
  hooks: {},
  modules: ["@nuxtjs/tailwindcss"],
});
