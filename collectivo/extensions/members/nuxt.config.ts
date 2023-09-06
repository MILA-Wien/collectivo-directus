// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  extends: ["@collectivo/core"],
  modules: ["@nuxtjs/i18n"],
  i18n: {
    lazy: true,
    langDir: "./lang",
    locales: [{ code: "en", file: "en.json" }],
  },
});
