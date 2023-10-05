import { CollectivoMigration } from "../utils/migrations";
import {
  DirectusCollection,
  DirectusField,
  NestedPartial,
  createItem,
  deleteCollection,
} from "@directus/sdk";

const migration: CollectivoMigration = {
  id: 2,
  name: "002_settings",
  up: createSettings,
  down: deleteSettings,
};

export default migration;

async function deleteSettings() {
  const directus = await useDirectus();
  await directus.request(deleteCollection("collectivo_settings"));
}

async function createSettings() {
  const collection: NestedPartial<DirectusCollection<any>> = {
    collection: "collectivo_settings",
    schema: {
      schema: "schema",
      name: "schema",
      comment: null,
    },
    meta: {
      icon: "settings",
      // @ts-ignore
      sort: 1,
      group: "collectivo_settings_folder",
      singleton: true,
      translations: [
        {
          language: "en-US",
          translation: "Project",
          singular: "Project",
          plural: "Project",
        },
        {
          language: "de-DE",
          translation: "Projekt",
          singular: "Projekte",
          plural: "Projekt",
        },
      ],
    },
  };

  const fields: NestedPartial<DirectusField<any>>[] = [
    {
      field: "collectivo_project_name",
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
      field: "collectivo_project_description",
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
      field: "collectivo_editor_role",
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

  await createOrUpdateDirectusCollection(collection, fields);
}

export async function down() {
  const directus = await useDirectus();
  await directus.request(deleteCollection("collectivo_settings"));
}
