import { defineNuxtPlugin, useRuntimeConfig } from "#app";
import Keycloak from "keycloak-js";

async function initKeycloak(keycloak) {
  const authenticated = await keycloak.init({
    onLoad: "login-required", // Redirect unauthenticated users to keycloak
    checkLoginIframe: false, // Prevent endless refresh loop (see #1)
  });
  console.log(
    `User is ${authenticated ? "authenticated" : "not authenticated"}`
  );
}

export default defineNuxtPlugin((app) => {
  console.log("Initializing keycloak client plugin");
  const runtimeConfig = useRuntimeConfig();

  const keycloak = new Keycloak({
    url: runtimeConfig.public.keycloak.url,
    realm: runtimeConfig.public.keycloak.realm,
    clientId: runtimeConfig.public.keycloak.client,
  });

  // keycloak.updateToken(2000);
  app.$keycloak = keycloak;
  initKeycloak(keycloak);
});

// #1 https://stackoverflow.com/a/70440366/14396787
