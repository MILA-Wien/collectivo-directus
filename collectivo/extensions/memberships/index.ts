import {
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
  setup(_, nuxt) {
    // here we need to setup our components
    // nuxt.hook("components:dirs", (dirs) => {
    //   dirs.push({
    //     path: join(__dirname, "lib/components"),
    //     prefix: "nx3",
    //   });
    // });

    nuxt.hook("ready", () => {
      console.log("Initializing collectivo/membership module");
      console.log("Starting migrations");
      // runMigrations().then(() => {
      //   console.log("Migrations complete");
      // });
    });

    extendPages((pages) => {
      // Add /test page
      pages.push({
        name: "Test2",
        path: "/memberships",
        file: resolve(__dirname, "./pages/test.vue"),
      });
    });
  },
});
