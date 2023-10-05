import {
  createDirectus,
  authentication,
  rest,
  AuthenticationClient,
  readMe,
  RestClient,
} from "@directus/sdk";

async function authorizeDirectus(directus: AuthenticationClient<any>) {
  // This should work after https://github.com/directus/directus/pull/19354
  const ar = await directus.refresh();
  console.log("Did i get directus refresh?", ar);
  // Meanwhile:
  // await directus.login("admin@example.com", "d1r3ctu5", {});
  return directus;
}

async function loadCurrentUser(directus: RestClient<CoreSchema>) {
  const user = useCurrentUser();
  // @ts-ignore
  user.value = await directus.request(
    readMe({
      fields: ["first_name", "last_name", "email"],
    })
  );
}

export default defineNuxtPlugin({
  name: "directus-client",
  enforce: "pre",
  async setup() {
    const runtimeConfig = useRuntimeConfig();
    var directus;
    var isAuthenticated = false;
    try {
      directus = createDirectus<CoreSchema>(
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
      loadCurrentUser(directus); // Performed async
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
