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

// Define extension setup function
export interface ExtensionConfig {
  extensionName: string;
  dependencies?: string[];
  preMigrations?: () => any;
  migrations?: (() => any)[];
  postMigrations?: () => any;
}

// Shared variables between extensions
var extensionConfigs: ExtensionConfig[] = [];
var extensions: any = null;

// Register extension and run setup and migration functions
export async function registerExtension(ext: ExtensionConfig) {
  // Check if setup should be run
  // This blocks extension dev servers as they have no .env file
  if (!useRuntimeConfig().runMigrations) {
    return;
  }

  // Check if extension is already registered in this server instance
  if (extensionConfigs.find((f) => f.extensionName === ext.extensionName)) {
    throw new Error(`Extension setup already run: ${ext.extensionName}`);
  }

  // Check if dependencies have been run
  if (ext.dependencies) {
    for (const dependency of ext.dependencies) {
      if (!extensionConfigs.find((f) => f.extensionName === dependency)) {
        throw new Error(
          `Setup of ${dependency} has to be run before ${ext.extensionName}`
        );
      }
    }
  }

  // Load registered extensions from db
  const directus = await useDirectus();
  if (extensions === null) {
    try {
      extensions = await directus.request(readItems("core_extensions"));
    } catch (e) {
      try {
        // Set up extension collection if it doesn't exist
        await createOrUpdateExtensionsCollection();
      } catch (e2) {
        console.error(e);
        console.error(e2);
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
    console.error(`Error running pre-migrations of ${ext.extensionName}`);
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
      console.error(e);
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
        console.error(
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
    console.error(`Error running post-migrations of ${ext.extensionName}`);
    throw error;
  }

  // Add setup to memory for dependency checks of upcoming setup functions
  extensionConfigs.push(ext);

  console.debug(`Setup of ${ext.extensionName} done`);
}

// Create or update extension collection
async function createOrUpdateExtensionsCollection() {
  const collection: NestedPartial<DirectusCollection<any>> = {
    collection: "core_extensions",
    schema: {
      schema: "schema",
      name: "schema",
      comment: null,
    },
    meta: {
      translations: [
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
        note: "Name of the extension (should not contain underscores)",
      },
    },
    {
      field: "core_version",
      type: "string",
      meta: {
        required: true,
        sort: 3,
        note: "Semantic version of the extension (e.g. 1.0.0)",
      },
    },
    {
      field: "core_migration",
      type: "integer",
      schema: { default_value: "0" },
      meta: {
        options: { iconLeft: "database" },
        sort: 4,
        note: "Number of the latest applied migration",
      },
      collection: "extensions",
    },
  ];

  // These will be deleted
  const oldFields: string[] = [];

  await createOrUpdateDirectusCollection(collection, fields, oldFields);
}
