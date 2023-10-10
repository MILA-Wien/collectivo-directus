import {
  createCollection,
  createField,
  DirectusCollection,
  DirectusField,
  NestedPartial,
  updateCollection,
  updateField,
  DirectusRelation,
  createRelation,
  updateRelation,
} from "@directus/sdk";
// // Remove old fields
// if (fieldsToRemove) {
//   for (const field of fieldsToRemove) {
//     try {
//       await directus.request(deleteField(collection.collection, field));
//       console.log(`Deleted field "${field}"`);
//     } catch (e) {
//       console.error(e);
//       throw new Error("Could not delete field");
//     }
//   }
// }

export async function createOrUpdateDirectusCollection(
  collection: NestedPartial<DirectusCollection<any>>,
  fields?: NestedPartial<DirectusField<any>>[],
  relations?: NestedPartial<DirectusRelation<any>>[]
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

  for (const field of fields ?? []) {
    await createOrUpdateDirectusField(collection.collection, field);
  }

  for (const relation of relations ?? []) {
    await createOrUpdateDirectusRelation(collection.collection, relation);
  }
}

export async function updateDirectusCollection(
  collection: NestedPartial<DirectusCollection<any>>,
  fields?: NestedPartial<DirectusField<any>>[],
  relations?: NestedPartial<DirectusRelation<any>>[]
) {
  if (!collection.collection) {
    throw new Error("Collection name is required");
  }
  const directus = await useDirectus();

  try {
    await directus.request(
      updateCollection(collection.collection, collection)
    );
    console.log(`Updated collection "${collection.collection}"`);
  } catch (e2) {
    console.error(e2);
    throw new Error("Could not create or update collection");
  }

  for (const field of fields ?? []) {
    await createOrUpdateDirectusField(collection.collection, field);
  }

  for (const relation of relations ?? []) {
    await createOrUpdateDirectusRelation(collection.collection, relation);
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

export async function createOrUpdateDirectusRelation(
  collectionName: string,
  relation: NestedPartial<DirectusRelation<any>>
) {
  if (!relation.field) {
    throw new Error("Relation name is required");
  }
  const directus = await useDirectus();
  try {
    await directus.request(createRelation(relation));
    console.log(`Created relation "${relation.field}"`);
  } catch (e) {
    try {
      await directus.request(
        updateRelation(collectionName, relation.field, relation)
      );
      console.log(`Updated relation "${relation.field}"`);
    } catch (e2) {
      console.error(e);
      console.error(e2);
      throw new Error("Could not create or update relation");
    }
  }
}
