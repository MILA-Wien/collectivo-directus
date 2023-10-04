import { CollectivoMigration } from "../utils/migrations";
import {
  DirectusCollection,
  DirectusField,
  NestedPartial,
  createItem,
  deleteCollection,
} from "@directus/sdk";

const migration: CollectivoMigration = {
  up: createTiles,
  down: deleteTiles,
};

export default migration;

async function deleteTiles() {
  const directus = await useDirectus();
  await directus.request(deleteCollection("core_tiles"));
}

async function createTiles() {
  const collection: NestedPartial<DirectusCollection<any>> = {
    collection: "core_tiles",
    schema: {
      schema: "schema",
      name: "schema",
      comment: null,
    },
    meta: {
      icon: "dashboard",
      // @ts-ignore
      sort: 10,
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

  const customFields: NestedPartial<DirectusField<any>>[] = [
    {
      field: "core_name",
      type: "string",

      schema: {
        is_nullable: false,
        is_unique: true,
      },
      meta: {
        sort: 2,
        required: true,
        translations: [
          { language: "en-US", translation: "Name" },
          { language: "de-DE", translation: "Name" },
        ],
      },
    },
    {
      field: "core_content",
      type: "text",
      schema: {},
      meta: {
        sort: 3,
        interface: "input-rich-text-md",
        options: {
          toolbar: [
            "heading",
            "bold",
            "italic",
            "strikethrough",
            "blockquote",
            "bullist",
            "numlist",
            "table",
            "code",
            "link",
            "empty",
          ],
          translations: [
            { language: "en-US", translation: "Content" },
            { language: "de-DE", translation: "Inhalt" },
          ],
        },
      },
    },
  ];

  await createOrUpdateDirectusCollection(
    collection,
    [directusStatusField, ...directusDefaultFields, ...customFields],
    []
  );

  // const directus = await useDirectus();

  // directus.request(createItem("core_settings", {}));
}

export async function down() {
  // Create or update extension collection
  console.log("Migration 001_test: down called");
}
