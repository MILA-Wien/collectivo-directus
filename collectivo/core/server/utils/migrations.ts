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
import { ch } from "@directus/sdk/dist/index-a2b3b0f1";

export interface CollectivoMigrationDependency {
  name: string;
  id: number;
}

export interface CollectivoMigration {
  up: () => Promise<void>;
  down: () => Promise<void>;
  dependencies?: CollectivoMigrationDependency[];
}

// Run a specific migration for an extension, regardless of current state in db
export async function forceMigration(ext: ExtensionConfig, id: number) {
  logger.info("Force Migration Not Implemented Yet");
}

// Run pending migrations for a set of extensions, based on current state in db
export async function runAllMigrations(exts: ExtensionConfig[]) {
  const extsDb = await getExtensionsFromDb();
  for (const ext of exts) {
    await runMigrations_(ext, extsDb);
  }
}

// Run migrations for an extension up to a specified target migration
export async function runMigrations(
  ext: ExtensionConfig,
  to?: number // Target migration number, if not specified, take from DB
) {
  const extsDb = await getExtensionsFromDb();
  await runMigrations_(ext, extsDb, to);
}

async function getExtensionsFromDb() {
  const directus = await useDirectus();
  var extensions: any = null;

  try {
    extensions = await directus.request(readItems("core_extensions"));
    if (extensions.length === 0) {
      return undefined;
    }
    return extensions;
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
    return [];
  }
}

async function runMigrations_(
  ext: ExtensionConfig,
  extsDb: any[],
  to?: number
) {
  const directus = await useDirectus();

  // Get data of current extension
  var extensionDb = extsDb.find((f) => f.core_name === ext.name);

  // Register extension if not found
  if (!extensionDb) {
    try {
      extensionDb = await directus.request(
        createItem("core_extensions", {
          core_name: ext.name,
          core_version: ext.version,
          core_migration_state: 0,
        })
      );
    } catch (e) {
      logger.error(e);
      throw new Error(`Error creating extension ${ext.name}`);
    }
  } else if (extensionDb.core_version !== ext.version) {
    await directus.request(
      updateItem("core_extensions", extensionDb.id, {
        core_version: ext.version,
      })
    );
  }

  // Run migration difference
  if (!ext.migrations) return;
  var migrationState = extensionDb ? extensionDb.core_migration_state : 0;
  const migrationTarget = to || ext.migrations.length;

  console.log(
    "Running migrations ",
    ext.name,
    migrationState,
    migrationTarget
  );

  if (migrationState < migrationTarget) {
    for (const migration of ext.migrations.slice(
      migrationState,
      migrationTarget
    )) {
      try {
        checkDependencies(migration, extsDb);
        await migration.up();
        migrationState++;
        await directus.request(
          updateItem("core_extensions", extensionDb.id, {
            core_migration_state: migrationState,
          })
        );
      } catch (e) {
        logger.error(
          `Error running migration ${migrationState} of ${ext.name}`
        );
        throw e;
      }
    }
  } else if (migrationState > migrationTarget) {
    for (const migration of ext.migrations
      .slice(migrationTarget, migrationState)
      .reverse()) {
      try {
        await migration.down();
        migrationState--;
        await directus.request(
          updateItem("core_extensions", extensionDb.id, {
            core_migration_state: migrationState,
          })
        );
      } catch (e) {
        logger.error(
          `Error running migration ${migrationState} of ${ext.name}`
        );
        throw e;
      }
    }
  }
}

// ----------------------------------------------------------------------------
// UTILS ----------------------------------------------------------------------
// ----------------------------------------------------------------------------

function checkDependencies(
  migration: CollectivoMigration,
  extsDb: any[]
): void {
  if (!migration.dependencies) return;
  for (const dep of migration.dependencies) {
    const depDb = extsDb.find((f) => f.core_name === dep.name);
    if (!depDb || depDb.core_migration_state < dep.id) {
      throw new Error(
        `Dependency not met: ${dep.name} must be at migration ${dep.id}`
      );
    }
  }
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
