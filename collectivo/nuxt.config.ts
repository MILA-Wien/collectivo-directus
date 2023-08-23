// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@collectivo/kit"],
  css: ["~/assets/css/main.css"],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  runtimeConfig: {
    directusAdminEmail: process.env.DIRECTUS_ADMIN_EMAIL,
    directusAdminPassword: process.env.DIRECTUS_ADMIN_PASSWORD,
    public: {
      directusUrl: process.env.DIRECTUS_API_URL,
    },
  },
});
