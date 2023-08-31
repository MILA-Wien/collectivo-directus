import {
  createDirectus,
  authentication,
  rest,
  AuthenticationClient,
} from "@directus/sdk";

async function authorizeDirectus(directus: AuthenticationClient<any>) {
  // This should work after https://github.com/directus/directus/pull/19354
  // const ar = await directus.refresh();
  // console.log("Did i get directus refresh?", ar);
  // Meanwhile:
  await directus.login("admin@example.com", "d1r3ctu5", {});
  return directus;
}

export default defineNuxtPlugin({
  name: "directus-client",
  enforce: "pre",
  async setup(nuxtApp) {
    console.log("Setting up Directus client plugin");
    const runtimeConfig = useRuntimeConfig();
    var directus;
    try {
      directus = createDirectus(runtimeConfig.public.directusUrl as string)
        .with(authentication())
        .with(rest());
      authorizeDirectus(directus);
      await directus.login("admin@example.com", "d1r3ctu5", {});
    } catch (e) {
      console.error("Failed to connect to Directus:", e);
    }
    return {
      provide: {
        directus: directus,
      },
    };
  },
});
