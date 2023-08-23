import { defineNuxtModule, extendPages, addPlugin } from "@nuxt/kit";
import { runMigrations } from "./server/directus";
import { join, resolve } from "path";
import { defu } from "defu";

export default defineNuxtModule({
  setup(_, nuxt) {
    nuxt.options.runtimeConfig.public.keycloak = {
      url: process.env.KEYCLOAK_URL ?? "",
      realm: process.env.KEYCLOAK_REALM ?? "",
      client: process.env.KEYCLOAK_CLIENT ?? "",
    };

    nuxt.options.runtimeConfig.public.directus = {
      url: process.env.DIRECTUS_URL ?? "",
    };

    // here we need to setup our components
    nuxt.hook("components:dirs", (dirs) => {
      dirs.push({
        path: join(__dirname, "lib/components"),
        prefix: "nx3",
      });
    });

    nuxt.hook("ready", () => {
      console.log("Initializing collectivo/sdk module");
      // console.log("Starting migrations");
      // runMigrations().then(() => {
      //   console.log("Migrations complete");
      // });
    });

    extendPages((pages) => {
      // Add /test page
      pages.push({
        name: "Test",
        path: "",
        file: resolve(__dirname, "./pages/test.vue"),
      });
    });

    addPlugin(resolve(__dirname, "./plugins/keycloak.client"));
  },
});
