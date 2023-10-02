import {
  DirectusCollection,
  DirectusField,
  NestedPartial,
  createItem,
} from "@directus/sdk";

export async function up() {
  // Create or update extension collection
  logger.info("Migration TEMPLATE: up called");

  const collection: NestedPartial<DirectusCollection<any>> = {
    collection: "core_settings",
    schema: {
      schema: "schema",
      name: "schema",
      comment: null,
    },
    meta: {
      icon: "settings",
      // @ts-ignore
      sort: 100,
      singleton: true,
      translations: [
        {
          language: "en-US",
          translation: "Settings",
          singular: "Settings",
          plural: "Settings",
        },
        {
          language: "de-DE",
          translation: "Einstellungen",
          singular: "Einstellungen",
          plural: "Einstellungen",
        },
      ],
    },
  };

  const fields: NestedPartial<DirectusField<any>>[] = [
    {
      field: "core_project_name",
      type: "string",
      meta: {
        sort: 2,
        hidden: false,
        translations: [
          { language: "en-US", translation: "Project name" },
          { language: "de-DE", translation: "Projektname" },
        ],
      },
      schema: {
        default_value: "Collectivo",
      },
    },
    {
      field: "core_project_description",
      type: "string",
      meta: {
        sort: 3,
        hidden: false,
        translations: [
          { language: "en-US", translation: "Project description" },
          { language: "de-DE", translation: "Projektbeschreibung" },
        ],
      },
    },
    {
      field: "core_editor_role",
      type: "string",
      meta: {
        hidden: true,
        sort: 100,
        translations: [
          { language: "en-US", translation: "Editor Role" },
          { language: "de-DE", translation: "Editor Rolle" },
        ],
        note: "ID of the editor role",
      },
    },
  ];

  // These will be deleted
  const oldFields: string[] = [];

  await createOrUpdateDirectusCollection(collection, fields, oldFields);

  // const directus = await useDirectus();

  // directus.request(createItem("core_settings", {}));
}

export async function down() {
  // Create or update extension collection
  console.log("Migration 001_test: down called");
}
