import {
  deleteCollection,
  readCollection,
  readFields,
  readFieldsByCollection,
  readItems,
} from "@directus/sdk";
import { RestClient, createCollection, createField } from "@directus/sdk";
var migrations: Record<string, any>[];

interface Migration {
  name: string;
  up: (directus: any) => Promise<void>;
  down: (directus: any) => Promise<void>;
}

// Create the collectivo_migrations collection
export async function initMigrations() {
  const directus = await useDirectus();
  console.log("Init migrations");
  try {
    const x = await directus.request(readCollection("collectivo_migrations"));
    console.log("Migrations collection exists", x);
    const y = await directus.request(
      readFieldsByCollection("collectivo_migrations")
    );
    console.log("Fields", y);
  } catch (e) {
    console.log("Creating migrations collection");
    createMigrationsCollection();
  }
  console.log("no error");
}

export async function createMigrationsCollection() {
  const directus = await useDirectus();
  console.log("Creating migrations collection");
  await directus.request(
    createCollection({
      collection: "collectivo_migrations",
      schema: {
        schema: "schema",
        name: "schema",
        comment: null,
      },
      meta: {
        translations: [
          {
            language: "de-DE",
            translation: "Migration",
            singular: "Migration",
            plural: "Migrationen",
          },
        ],
      },
    })
  );

  console.log("Creating migrations fields");
  for (const fieldName of ["name", "extension"]) {
    await directus.request(
      createField("collectivo_migrations", {
        field: fieldName,
        type: "string",
        meta: {},
      })
    );
  }

  createField("collectivo_migrations", {
    field: "date_created",
    type: "string",
    meta: {
      interface: "datetime",
      special: ["date-created"],
    },
  });

  console.log("Migrations collection created");
}

export async function getMigrationRecord() {
  const directus = await useDirectus();
  migrations = await directus.request(readItems("collectivo_migrations"));
  return migrations;
}

export async function runMigrations(migrations: Migration[]) {
  const directus = await useDirectus();
  // const migrationList = await getMigrationRecord();
  // console.log("Migrations", migrationList);
  // Loop through all migrations
  for (const migration of migrations) {
    // Check if migration has already been run
    // if (migrationList.find((m) => m.name === migration.name)) {
    //   continue;
    // }
    // Run migration
    await migration.up(directus);
    // Record migration
    // await directus.request(createItem("collectivo_migrations", { name: migration.name }));
  }
  return;
}
