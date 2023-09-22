import {
  createDirectus,
  authentication,
  rest,
  AuthenticationClient,
} from "@directus/sdk";

async function authorizeDirectus(directus: AuthenticationClient<any>) {
  // This should work after https://github.com/directus/directus/pull/19354
  const ar = await directus.refresh();
  console.log("Did i get directus refresh?", ar);
  // Meanwhile:
  // await directus.login("admin@example.com", "d1r3ctu5", {});
  return directus;
}

export default defineNuxtPlugin({
  name: "directus-client",
  enforce: "pre",
  async setup() {
    const runtimeConfig = useRuntimeConfig();
    var directus;
    var isAuthenticated = false;
    try {
      directus = createDirectus<CollectivoCoreSchema>(
        runtimeConfig.public.directusUrl as string
      )
        .with(
          authentication("json", {
            autoRefresh: false,
            credentials: "include",
          })
        )
        .with(rest({ credentials: "include" }));
      await directus.refresh();
      isAuthenticated = true;
    } catch (e) {
      console.log("User is not authenticated");
    }
    return {
      provide: {
        directus: directus ? directus : null,
        isAuthenticated: isAuthenticated,
      },
    };
  },
});
