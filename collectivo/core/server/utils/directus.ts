import {
  createDirectus,
  authentication,
  rest,
  DirectusClient,
  AuthenticationClient,
  RestClient,
} from "@directus/sdk";

// Shared server variable
var directus: DirectusClient<any> &
  AuthenticationClient<any> &
  RestClient<any>;

// Return Directus admin client for server plugins
export async function useDirectus() {
  const config = useRuntimeConfig();
  if (directus === undefined) {
    directus = createDirectus(config.public.directusUrl)
      .with(authentication())
      .with(rest());
    await directus.login(
      config.directusAdminEmail,
      config.directusAdminPassword,
      {}
    );
  }
  return directus;
}
