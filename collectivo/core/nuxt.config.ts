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
    ready: async (nuxt) => {
      console.log(`Collectivo ${pkg.version}`);

      for (const layer of nuxt.options._layers) {
        // You can check for a custom directory existence to extend for each layer
        console.log("Custom extension for", layer.cwd);
        console.log(
          layer.config.migrations ? layer.config.migrations() : "no migrations"
        );
      }
    },
  },
  modules: ["@nuxtjs/tailwindcss"],
});
