import {
  createItem,
  readItems,
  updateItem,
  createCollection,
  createField,
  DirectusCollection,
  DirectusField,
  NestedPartial,
  readCollection,
  updateCollection,
  updateField,
} from "@directus/sdk";

import { ExtensionConfig } from "./extensions";

// Run a specific migration for an extension, regardless of current state in db
export async function forceMigration(ext: ExtensionConfig, id: number) {
  logger.info("Force Migration Not Implemented Yet");
}

// Run migrations for a set of extensions, based on current state in db
export async function runMigrations(
  exts: ExtensionConfig[], // Extensions to run migrations for
  to?: number // Target migration number, if not specified, take from DB
) {
  for (const ext of exts) {
    await runMigration(ext, to);
  }
}

async function runMigration(ext: ExtensionConfig, to?: number) {
  // Load registered extensions from db
  const directus = await useDirectus();
  var extensions: any = null;

  if (extensions === null) {
    try {
      extensions = await directus.request(readItems("core_extensions"));
    } catch (e) {
      try {
        // Set up extension collection if it doesn't exist
        await createOrUpdateExtensionsCollection();
      } catch (e2) {
        logger.log({
          level: "error",
          message: `Error reading or creating extensions collection`,
          error: e,
        });
        logger.log({
          level: "error",
          message: `Error reading or creating extensions collection`,
          error: e2,
        });
        throw new Error("Error reading or creating extensions collection");
      }
      extensions = [];
    }
  }

  // Run pre-migration setup
  try {
    if (ext.preMigrations) await ext.preMigrations();
  } catch (errorPromise) {
    const error = await errorPromise;
    logger.error(`Error running pre-migrations of ${ext.extensionName}`);
    throw error;
  }

  // Get data of current extension
  var extensionDb = extensions.find(
    (f: any) => f.core_name === ext.extensionName
  );
  var migrationState = extensionDb ? extensionDb.core_migration : 0;

  // Register extension if not found
  if (!extensionDb) {
    try {
      extensionDb = await directus.request(
        createItem("core_extensions", {
          core_name: ext.extensionName,
          core_version: "0.0.0",
          core_migration: 0,
        })
      );
    } catch (e) {
      logger.error(e);
      throw new Error(`Error creating extension ${ext.extensionName}`);
    }
  }

  // Run missing migrations
  if (ext.migrations) {
    for (const migration of ext.migrations.slice(migrationState)) {
      try {
        await migration();

        // Update migration state in db
        migrationState++;
        await directus.request(
          updateItem("core_extensions", extensionDb.id, {
            core_migration: migrationState,
          })
        );
      } catch (e) {
        logger.error(
          `Error running migration ${migrationState} of ${ext.extensionName}`
        );
        throw e;
      }
    }
  }

  // Run post-migration extension setup
  try {
    if (ext.postMigrations) await ext.postMigrations();
  } catch (error) {
    logger.error(`Error running post-migrations of ${ext.extensionName}`);
    throw error;
  }
}

// ----------------------------------------------------------------------------
// UTILS ----------------------------------------------------------------------
// ----------------------------------------------------------------------------

// Create or update extension collection
export async function createOrUpdateExtensionsCollection() {
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
      field: "core_is_active",
      type: "boolean",
      schema: { default_value: true, is_nullable: false },
      meta: {
        interface: "boolean",
        sort: 3,
        display: "boolean",
        display_options: {
          labelOn: "Active",
          labelOff: "Disabled",
          iconOn: "launcher_assistant_on",
          colorOn: "#2ECDA7",
          colorOff: "#77767B",
          iconOff: "circle",
        },
        translations: [
          { language: "en-US", translation: "Status" },
          { language: "de-DE", translation: "Status" },
        ],
      },
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
      field: "core_migration",
      type: "integer",
      schema: { default_value: "0" },
      meta: {
        translations: [
          { language: "en-US", translation: "Migration" },
          { language: "de-DE", translation: "Migration" },
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
