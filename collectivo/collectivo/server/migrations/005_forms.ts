import {
  DirectusCollection,
  DirectusField,
  NestedPartial,
  deleteCollection,
} from "@directus/sdk";

const migration = {
  id: 4,
  name: "004_tiles",
  up: createTiles,
  down: deleteTiles,
};

export default migration;

async function deleteTiles() {
  const directus = await useDirectus();
  await directus.request(deleteCollection("collectivo_tiles"));
}

async function createTiles() {
  const collection: NestedPartial<DirectusCollection<any>> = {
    collection: "collectivo_forms",
    schema: {
      schema: "schema",
      name: "schema",
      comment: null,
    },
    meta: {
      icon: "edit_note",
      // @ts-ignore
      sort: 30,
      archive_field: "status",
      archive_value: "archived",
      sort_field: "sort",
      unarchive_value: "published",
      translations: [
        {
          language: "en-US",
          translation: "Tiles",
          singular: "Tile",
          plural: "Tiles",
        },
        {
          language: "de-DE",
          translation: "Kacheln",
          singular: "Kachel",
          plural: "Kacheln",
        },
      ],
    },
  };

  const fields: NestedPartial<DirectusField<any>>[] = [
    NAME_FIELD,
    SORT_FIELD,
    STATUS_FIELD,
    ...DIRECTUS_SYSTEM_FIELDS,
    // Permissions
    // M2M Form Actions
    // M2A Form sections/fields/etc.
  ];

  await createOrUpdateDirectusCollection(collection, fields);
}
