import { defineNuxtModule } from "@nuxt/kit";
import { join } from "path";

export default defineNuxtModule({
  setup(_, nuxt) {
    // here we need to setup our components
    nuxt.hook("components:dirs", (dirs) => {
      dirs.push({
        path: join(__dirname, "lib/components"),
        prefix: "nx3",
      });
    });
  },
});
