// https://nuxt.com/docs/api/configuration/nuxt-config
import pkg from "./package.json";

export default defineNuxtConfig({
  devtools: { enabled: true },
  runtimeConfig: {
    directusAdminUser: process.env.DIRECTUS_ADMIN_USER ?? "",
    directusAdminPass: process.env.DIRECTUS_ADMIN_PASS ?? "",
    public: {
      keycloakUrl: process.env.KEYCLOAK_URL ?? "",
      keycloakRealm: process.env.KEYCLOAK_REALM ?? "",
      keycloakClient: process.env.KEYCLOAK_CLIENT ?? "",
      directusUrl: process.env.DIRECTUS_URL ?? "",
    },
  },
  hooks: {
    ready: () => {
      console.log(`Collectivo ${pkg.version}`);
    },
  },
  modules: ["@nuxtjs/tailwindcss"],
});
