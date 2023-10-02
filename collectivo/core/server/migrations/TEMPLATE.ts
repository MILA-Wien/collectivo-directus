import {
  DirectusCollection,
  DirectusField,
  NestedPartial,
} from "@directus/sdk";

export async function up() {
  // Create or update extension collection
  logger.info("Migration TEMPLATE: up called");

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
      field: "extensionName_fieldName",
      type: "string",
      meta: {
        required: true,
        sort: 2, // Order of the field, 1 is id
        translations: [
          { language: "en-US", translation: "Name" },
          { language: "de-DE", translation: "Name" },
        ],
        note: "Explain what the field does",
      },
    },
  ];

  // These will be deleted
  const oldFields: string[] = [];

  await createOrUpdateDirectusCollection(collection, fields, oldFields);
}

export async function down() {
  // Create or update extension collection
  console.log("Migration 001_test: down called");
}
