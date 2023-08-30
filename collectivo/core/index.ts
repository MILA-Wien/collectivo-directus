import {
  createResolver,
  installModule,
  defineNuxtModule,
  extendPages,
  addPlugin,
  addTemplate,
  addLayout,
} from "@nuxt/kit";
import { runMigrations } from "./server/directus";
import { join, resolve } from "path";
import { defu } from "defu";

export default defineNuxtModule({
  async setup(_, nuxt) {
    const { resolve } = createResolver(import.meta.url);

    // Configure styles
    nuxt.options.css.push(resolve("./assets/styles.css"));
    await installModule("@nuxtjs/tailwindcss", {
      exposeConfig: true,
      config: {
        darkMode: "media",
        content: {
          files: [
            resolve("./components/**/*.{vue,mjs,ts}"),
            resolve("./pages/*.{vue,mjs,ts}"),
            resolve("./layouts/*.{vue,mjs,ts}"),
          ],
        },
      },
    });

    // Add runtime settings
    nuxt.options.runtimeConfig.public.keycloak = {
      url: process.env.KEYCLOAK_URL ?? "",
      realm: process.env.KEYCLOAK_REALM ?? "",
      client: process.env.KEYCLOAK_CLIENT ?? "",
    };

    nuxt.options.runtimeConfig.public.directus = {
      url: process.env.DIRECTUS_URL ?? "",
    };

    // Add pages
    extendPages((pages) => {
      pages.push({
        name: "Home",
        path: "",
        file: resolve(__dirname, "./pages/dashboard.vue"),
      });
    });

    // Register components
    nuxt.hook("components:dirs", (dirs) => {
      dirs.push({
        path: join(__dirname, "components"),
        prefix: "collectivo",
      });
    });

    // Register layout
    const defaultLayout = addTemplate({
      src: resolve(__dirname, "./layouts/default.vue"),
      write: true,
    });
    addLayout(defaultLayout, "collectivo-default");

    // Run migrations
    nuxt.hook("ready", () => {
      console.log("Initializing collectivo/sdk module");
      console.log("Starting migrations");
      // runMigrations().then(() => {
      //   console.log("Migrations complete");
      // });
    });

    // Add plugins
    addPlugin(resolve(__dirname, "./plugins/directus.client"));
  },
});
