// https://nuxt.com/docs/api/configuration/nuxt-config
import pkg from "./package.json";

export default defineNuxtConfig({
  devtools: { enabled: true },
  runtimeConfig: {
    collectivoVersion: pkg.version,
    runMigrations: process.env.COLLECTIVO_RUN_SETUP == "true" ?? false,
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
  modules: ["@nuxtjs/tailwindcss", "@nuxtjs/i18n"],
  // https://v8.i18n.nuxtjs.org/guide/layers
  i18n: {
    lazy: true,
    langDir: "./lang",
    locales: [{ code: "en", file: "en.json" }],
    strategy: "no_prefix",
    defaultLocale: "en",
  },
});
