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
import ExtensionCollectionMigration from "./../migrations/001_extensions";

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
export async function forceMigration(
  ext: ExtensionConfig,
  id: number,
  down?: boolean
) {
  if (!ext.migrations) return;
  const migration = ext.migrations[id - 1];
  try {
    if (down) {
      await migration.down();
    } else {
      await migration.up();
    }
  } catch (e) {
    logger.error(
      `Error running forced migration ${id} (down=${down}) of ${ext.name}`
    );
    throw e;
  }
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
      // Run initial migration if extensions collection is not found
      await ExtensionCollectionMigration.up();
      await directus.request(
        createItem("core_extensions", {
          core_name: "core",
          core_version: "0.0.0",
          core_migration_state: 1,
        })
      );
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

  if (migrationState === migrationTarget) return;

  logger.info(
    `Migrating ${ext.name} from ${migrationState} to ${migrationTarget}`
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

  logger.info(`Migrations of ${ext.name} successful`);
}

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
