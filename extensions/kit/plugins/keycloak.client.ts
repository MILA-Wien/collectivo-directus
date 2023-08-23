import { defineNuxtPlugin, useRuntimeConfig } from "#app";
import Keycloak from "keycloak-js";
import {
  createDirectus,
  authentication,
  rest,
  readItems,
  createCollection,
  createItem,
  createField,
  refresh,
} from "@directus/sdk";

async function initKeycloak(keycloak) {
  const authenticated = await keycloak.init({
    onLoad: "login-required", // Redirect unauthenticated users to keycloak
    checkLoginIframe: false, // Prevent endless refresh loop (see #1)
  });
  console.log(
    `User is ${authenticated ? "authenticated" : "not authenticated"}`
  );
  const runtimeConfig = useRuntimeConfig();
  console.log("Now trying directus");
  const directus = createDirectus(runtimeConfig.public.directus.url)
    .with(authentication())
    .with(rest());
  // directus.refresh();
  // const x = await directus.request(refresh("", "cookie"));
  // const email = process.env.DIRECTUS_ADMIN_EMAIL ?? "";
  // const password = process.env.DIRECTUS_ADMIN_PASSWORD ?? "";
  // const tokenSet = await directus.login("", "", { mode: "cookie" });
  // console.log("Did i get directus tokens?", tokenSet);
  const x = await fetch("http://localhost:8055/auth/refresh", {
    method: "POST",
    credentials: "include",
  });
  const y = await x.json();
  console.log("Did i get directus tokens?", y);
  directus.setToken(y.access_token);
  const z = await directus.request(readItems("users"));
  console.log("Did i get directus users?", z);
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
  app.$keycloak = keycloak;
  initKeycloak(keycloak);
});

// #1 https://stackoverflow.com/a/70440366/14396787
