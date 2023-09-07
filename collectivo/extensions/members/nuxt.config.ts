// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  extends: ["@collectivo/core"],
  i18n: {
    langDir: "./lang",
    locales: [{ code: "en", file: "en.json" }],
  },
});
