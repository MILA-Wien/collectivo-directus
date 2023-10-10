import { CollectivoMigration } from "../utils/migrations";
import {
  createFolder,
  deleteCollection,
  DirectusCollection,
  DirectusField,
  NestedPartial,
} from "@directus/sdk";

const migration: CollectivoMigration = {
  id: 1,
  name: "001_extensions",
  up: createExtensions,
  down: deleteExtensions,
};

export default migration;

async function deleteExtensions() {
  const directus = await useDirectus();
  await directus.request(deleteCollection("collectivo_extensions"));
}

async function createExtensions() {
  // Extensions ---------------------------------------------------------------
  const collection: NestedPartial<DirectusCollection<any>> = {
    collection: "collectivo_extensions",
    schema: {
      schema: "schema",
      name: "schema",
      comment: null,
    },
    meta: {
      // @ts-ignore
      sort: 90,
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
      field: "name",
      type: "string",
      schema: { is_unique: true, is_nullable: false },
      meta: {
        required: true,
        width: "half",
        sort: 1,
        translations: [
          { language: "en-US", translation: "Name" },
          { language: "de-DE", translation: "Name" },
        ],
        note: "Name of the extension (should not contain underscores)",
      },
    },
    {
      field: "status",
      type: "string",
      meta: {
        width: "half",
        sort: 2,
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
      field: "version",
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
      field: "migration_state",
      type: "integer",
      schema: { default_value: "0" },
      meta: {
        translations: [
          { language: "en-US", translation: "Migration state" },
          { language: "de-DE", translation: "Migrationslevel" },
        ],
        options: { iconLeft: "database" },
        sort: 5,
        note: "The number of applied migrations",
      },
      collection: "extensions",
    },
  ];

  await createOrUpdateDirectusCollection(collection, fields);
}
