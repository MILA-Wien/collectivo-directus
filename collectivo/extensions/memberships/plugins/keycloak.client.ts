import { defineNuxtPlugin, useRuntimeConfig } from "#app";
import Keycloak from "keycloak-js";
import fetchJsonp from "fetch-jsonp";
import {
  createDirectus,
  authentication,
  rest,
  readItems,
  createCollection,
  createItem,
  createField,
  refresh,
  memoryStorage,
  AuthenticationData,
} from "@directus/sdk";

async function initKeycloak(keycloak) {
  // Not really needed as we authenticate through Directus
  const authenticated = await keycloak.init({
    onLoad: "check-sso", // Redirect unauthenticated users to keycloak
    checkLoginIframe: false, // Prevent endless refresh loop (see #1)
  });
  console.log(
    `Keycloak User is ${authenticated ? "authenticated" : "not authenticated"}`
  );
  const runtimeConfig = useRuntimeConfig();

  // Directus connection
  // TODO MOVE THIS
  const directus = createDirectus(runtimeConfig.public.directus.url)
    .with(authentication())
    .with(rest());

  // This should work after https://github.com/directus/directus/pull/19354
  // const ar = await directus.refresh();
  // console.log("Did i get directus refresh?", ar);
  // Meanwhile:
  await directus.login("admin@example.com", "d1r3ctu5", {});
}

export default defineNuxtPlugin((app) => {
  console.log("Initializing keycloak client plugin");
  const runtimeConfig = useRuntimeConfig();
  console.log(runtimeConfig.public.keycloak);
  const keycloak = new Keycloak({
    url: runtimeConfig.public.keycloak.url,
    realm: runtimeConfig.public.keycloak.realm,
    clientId: runtimeConfig.public.keycloak.client,
  });

  // keycloak.updateToken(2000);
  // app.$keycloak = keycloak;
  initKeycloak(keycloak);

  return {
    provide: {
      keycloak: keycloak,
    },
  };
});

// #1 https://stackoverflow.com/a/70440366/14396787
