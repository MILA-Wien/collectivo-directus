// https://github.com/directus/examples/blob/main/nuxtjs/modules/directus/plugin.js
import {
  createDirectus,
  authentication,
  rest,
  readItems,
  createCollection,
  createItem,
  createField,
} from "@directus/sdk";
import type { DirectusCollection } from "@directus/sdk";

const adminClient = createDirectus(process.env.DIRECTUS_URL ?? "")
  .with(authentication())
  .with(rest());
var adminClientActive = false;

export async function getDirectusAdminClient() {
  if (adminClientActive) {
    console.log("Returning existing client");
    return adminClient;
  }
  const email = process.env.DIRECTUS_ADMIN_EMAIL ?? "";
  const password = process.env.DIRECTUS_ADMIN_PASSWORD ?? "";
  const tokenSet = await adminClient.login(email, password, { mode: "json" });
  adminClientActive = true;
  console.log("Returning new client");
  console.log("x:", tokenSet);
  console.log(email, password);
  return adminClient;
}

// Create an instance of type DirectusCollection
const collection = <DirectusCollection<{}>>{
  collection: "myCollection",
};

// Run migrations on Directus
export async function runMigrations() {
  const client = await getDirectusAdminClient();
  console.log("Directus client:", client);
  // const result = await client.request(readItems("articles"));
  // console.log("Directus result:", result);
  const result3 = await client.request(
    createItem("articles", { title: "test" })
  );
  console.log("Directus result POST ARTICLE:", result3);

  try {
    const result4 = await client.request(
      createField("articles", {
        field: "test",
        type: "string",
      })
    );
    console.log("Directus result FIELD:", result4);
  } catch (e) {
    console.log("Directus result FIELD:", e);
  }

  const result2 = await client.request(
    createCollection({
      collection: "myCollection",
      schema: {
        schema: "test-schema",
        name: "test-schema",
        comment: null,
      },
      meta: {},
    })
  );
  console.log("Directus result COLL:", result2);
}
