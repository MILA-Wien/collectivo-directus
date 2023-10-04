import { CollectivoMigration } from "../utils/migrations";
import {
  DirectusCollection,
  DirectusField,
  NestedPartial,
  createItem,
  deleteCollection,
} from "@directus/sdk";

const migration: CollectivoMigration = {
  up: createTags,
  down: deleteTags,
};

export default migration;

async function deleteTags() {
  const directus = await useDirectus();
  await directus.request(deleteCollection("core_tags"));
}

async function createTags() {
  const customFields: NestedPartial<DirectusField<any>>[] = [
    {
      field: "core_name",
      type: "string",
      schema: {
        is_nullable: false,
        is_unique: true,
      },
      meta: {
        required: true,
        translations: [
          { language: "en-US", translation: "Name" },
          { language: "de-DE", translation: "Name" },
        ],
      },
    },
  ];

  const collection: NestedPartial<DirectusCollection<any>> = {
    collection: "core_tags",
    schema: {
      schema: "schema",
      name: "schema",
      comment: null,
    },
    //fields: directusDefaultFields, //[...directusDefaultFields, ...customFields],
    meta: {
      icon: "label",
      // @ts-ignore
      sort: 20,
      archive_field: "status",
      archive_value: "archived",
      sort_field: "sort",
      unarchive_value: "published",
      translations: [
        {
          language: "en-US",
          translation: "Tags",
          singular: "Tag",
          plural: "Tags",
        },
        {
          language: "de-DE",
          translation: "Tags",
          singular: "Tag",
          plural: "Tags",
        },
      ],
    },
  };

  await createOrUpdateDirectusCollection(
    collection,
    [
      directusStatusFieldWithoutDraft,
      ...directusDefaultFields,
      ...customFields,
    ],
    []
  );

  // const directus = await useDirectus();

  // directus.request(createItem("core_settings", {}));
}

export async function down() {
  // Create or update extension collection
  console.log("Migration 001_test: down called");
}
