import {
  createDirectus,
  authentication,
  rest,
  DirectusClient,
  AuthenticationClient,
  RestClient,
  createCollection,
  createField,
  DirectusCollection,
  DirectusField,
  NestedPartial,
  updateCollection,
  updateField,
  deleteField,
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

export async function createOrUpdateDirectusCollection(
  collection: NestedPartial<DirectusCollection<any>>,
  fields: NestedPartial<DirectusField<any>>[],
  oldFields: string[] = []
) {
  if (!collection.collection) {
    throw new Error("Collection name is required");
  }
  const directus = await useDirectus();
  try {
    await directus.request(createCollection(collection));
    console.log(`Created collection "${collection.collection}"`);
  } catch (e) {
    try {
      await directus.request(
        updateCollection(collection.collection, collection)
      );
      console.log(`Updated collection "${collection.collection}"`);
    } catch (e2) {
      console.error(e);
      console.error(e2);
      throw new Error("Could not create or update collection");
    }
  }

  // Remove old fields
  for (const field of oldFields) {
    try {
      await directus.request(deleteField(collection.collection, field));
      console.log(`Deleted field "${field}"`);
    } catch (e) {
      console.error(e);
      throw new Error("Could not delete field");
    }
  }

  for (const field of fields) {
    await createOrUpdateDirectusField(collection.collection, field);
  }
}

export async function createOrUpdateDirectusField(
  collectionName: string,
  field: NestedPartial<DirectusField<any>>
) {
  if (!field.field) {
    throw new Error("Field name is required");
  }
  const directus = await useDirectus();
  try {
    await directus.request(createField(collectionName, field));
    console.log(`Created field "${field.field}"`);
  } catch (e) {
    try {
      await directus.request(updateField(collectionName, field.field, field));
      console.log(`Updated field "${field.field}"`);
    } catch (e2) {
      console.error(e);
      console.error(e2);
      throw new Error("Could not create or update field");
    }
  }
}
