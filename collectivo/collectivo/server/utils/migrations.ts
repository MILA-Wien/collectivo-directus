import { createItem, readItems, updateItem } from "@directus/sdk";

import { ExtensionConfig } from "./extensions";
import ExtensionCollectionMigration from "./../migrations/001_extensions";

export interface CollectivoMigrationDependency {
  extensionName: string;
  migrationId: number;
}

export interface CollectivoMigration {
  id: number;
  name: string;
  description?: string;
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
  const direction = down ? "down" : "up";
  logger.info(`Forced migration ${id} (${direction}) of ${ext.name} starting`);
  if (!ext.migrations) return;
  const migration = ext.migrations[id - 1];
  try {
    if (down) {
      await migration.down();
    } else {
      console.log("running up");
      await migration.up();
    }
  } catch (e) {
    logger.error(
      `Error running forced migration ${id} (down=${down}) of ${ext.name}`
    );
    throw e;
  }
  logger.info(
    `Forced migration ${id} (${direction}) of ${ext.name} successful`
  );
}

// Run pending migrations for a set of extensions, based on current state in db
export async function runAllMigrations(
  exts: ExtensionConfig[],
  createDemoData: boolean = false
) {
  const extsDb = await getExtensionsFromDb();
  for (const ext of exts) {
    await runMigrations_(ext, extsDb);
  }
  if (createDemoData) {
    for (const ext of exts) {
      if (ext.demoData) {
        await ext.demoData();
      }
    }
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
    extensions = await directus.request(readItems("collectivo_extensions"));
    if (extensions.length === 0) {
      return undefined;
    }
    return extensions;
  } catch (e) {
    try {
      // Run initial migration if extensions collection is not found
      await ExtensionCollectionMigration.up();
      await directus.request(
        createItem("collectivo_extensions", {
          name: "collectivo",
          version: "0.0.0",
          migration_state: 1,
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
    extensions = await directus.request(readItems("collectivo_extensions"));
    if (extensions.length === 0) {
      return undefined;
    }
    return extensions;
  }
}

async function runMigrations_(
  ext: ExtensionConfig,
  extsDb: any[],
  to?: number
) {
  const directus = await useDirectus();

  // Get data of current extension
  var extensionDb = extsDb.find((f) => f.name === ext.name);

  // Register extension if not found
  if (!extensionDb) {
    try {
      extensionDb = await directus.request(
        createItem("collectivo_extensions", {
          name: ext.name,
          version: ext.version,
          migration_state: 0,
        })
      );
    } catch (e) {
      logger.error(e);
      throw new Error(`Error creating extension ${ext.name}`);
    }
  } else if (extensionDb.version !== ext.version) {
    await directus.request(
      updateItem("collectivo_extensions", extensionDb.id, {
        version: ext.version,
      })
    );
  }

  // Run migration difference
  if (!ext.migrations) return;
  var migrationState = extensionDb ? extensionDb.migration_state : 0;
  const migrationTarget = to != undefined ? to : ext.migrations.length;

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
          updateItem("collectivo_extensions", extensionDb.id, {
            migration_state: migrationState,
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
          updateItem("collectivo_extensions", extensionDb.id, {
            migration_state: migrationState,
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
    const depDb = extsDb.find((f) => f.name === dep.extensionName);
    if (!depDb || depDb.migration_state < dep.migrationId) {
      throw new Error(
        `Dependency not met: ${dep.extensionName} must be at migration ${dep.migrationId}`
      );
    }
  }
}
