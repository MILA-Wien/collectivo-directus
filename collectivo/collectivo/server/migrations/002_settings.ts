import { CollectivoMigration } from "../utils/migrations";
import {
  DirectusCollection,
  DirectusField,
  NestedPartial,
  createItem,
  createRole,
  deleteCollection,
  readRoles,
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

async function createCollectivoRole(
  name: string,
  app_access = false,
  admin_access = false
) {
  const directus = await useDirectus();

  const membersRoles = await directus.request(
    readRoles({
      filter: {
        name: { _eq: name },
      },
    })
  );

  if (membersRoles.length > 0) return;

  await directus.request(
    createRole({
      name: name,
      admin_access: admin_access,
      app_access: app_access,
    })
  );
}

async function createSettings() {
  createCollectivoRole("collectivo_member");
  createCollectivoRole("collectivo_editor", true);
  createCollectivoRole("collectivo_admin", true, true);

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
      sort: 1000,
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
  ];

  // These will be deleted
  const oldFields: string[] = [];

  await createOrUpdateDirectusCollection(collection, fields);

  // Add extensions to settnigs
  const extensions: NestedPartial<DirectusCollection<any>> = {
    collection: "collectivo_extensions",
    meta: {
      group: "collectivo_settings",
    },
  };

  await updateDirectusCollection(extensions);
}

export async function down() {
  const directus = await useDirectus();
  await directus.request(deleteCollection("collectivo_settings"));
}
