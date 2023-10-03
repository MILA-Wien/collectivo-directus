import { CollectivoMigration } from "../utils/migrations";
import {
  deleteCollection,
  DirectusCollection,
  DirectusField,
  NestedPartial,
} from "@directus/sdk";

const migration: CollectivoMigration = {
  up: createOrUpdateExtensionsCollection,
  down: deleteExtensionsCollection,
};

export default migration;

async function deleteExtensionsCollection() {
  const directus = await useDirectus();
  await directus.request(deleteCollection("core_extensions"));
}

async function createOrUpdateExtensionsCollection() {
  const collection: NestedPartial<DirectusCollection<any>> = {
    collection: "core_extensions",
    schema: {
      schema: "schema",
      name: "schema",
      comment: null,
    },
    meta: {
      icon: "extension",
      translations: [
        {
          language: "en-US",
          translation: "Extensions",
          singular: "Extension",
          plural: "Extensions",
        },
        {
          language: "de-DE",
          translation: "Erweiterungen",
          singular: "Erweiterung",
          plural: "Erweiterungen",
        },
      ],
    },
  };

  const fields: NestedPartial<DirectusField<any>>[] = [
    {
      field: "core_name",
      type: "string",
      schema: { is_unique: true, is_nullable: false },
      meta: {
        required: true,
        sort: 2, // 1 is id
        translations: [
          { language: "en-US", translation: "Name" },
          { language: "de-DE", translation: "Name" },
        ],
        note: "Name of the extension (should not contain underscores)",
      },
    },
    {
      field: "core_status",
      type: "string",
      meta: {
        width: "full",
        sort: 3,
        options: {
          choices: [
            { text: "$t:active", value: "active" },
            { text: "$t:disabled", value: "disabled" },
          ],
        },
        interface: "select-dropdown",
        display: "labels",
        display_options: {
          showAsDot: true,
          choices: [
            {
              text: "$t:active",
              value: "active",
              foreground: "#FFFFFF",
              background: "var(--primary)",
            },
            {
              text: "$t:disabled",
              value: "disabled",
              foreground: "#18222F",
              background: "#D3DAE4",
            },
          ],
        },
        translations: [
          { language: "en-US", translation: "Status" },
          { language: "de-DE", translation: "Status" },
        ],
      },
      schema: { default_value: "active", is_nullable: false },
    },
    {
      field: "core_version",
      type: "string",
      meta: {
        translations: [
          { language: "en-US", translation: "Version" },
          { language: "de-DE", translation: "Version" },
        ],
        required: true,
        sort: 4,
        note: "Semantic version of the extension (e.g. 1.0.0)",
      },
    },
    {
      field: "core_migration_state",
      type: "integer",
      schema: { default_value: "0" },
      meta: {
        translations: [
          { language: "en-US", translation: "Migration state" },
          { language: "de-DE", translation: "Migrations status" },
        ],
        options: { iconLeft: "database" },
        sort: 5,
        note: "The number of applied migrations",
      },
      collection: "extensions",
    },
  ];

  // These will be deleted
  const oldFields: string[] = [];

  await createOrUpdateDirectusCollection(collection, fields, oldFields);
}
