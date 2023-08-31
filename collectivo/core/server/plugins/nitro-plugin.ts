import {
  createDirectus,
  authentication,
  rest,
  AuthenticationClient,
} from "@directus/sdk";
import pkg from "../../package.json";
import { migrate } from "../migrations/test";

export default defineNitroPlugin((nitroApp) => {
  console.log("Nitro plugin starting", pkg.name);
  const runtimeConfig = useRuntimeConfig();
  if (!runtimeConfig.public.directusUrl) {
    return;
  }
  console.log(runtimeConfig);
  const directus = createDirectus(runtimeConfig.public.directusUrl as string)
    .with(authentication())
    .with(rest());
  directus.login("admin@example.com", "d1r3ctu5", {});

  migrate();
});
