import {
  DirectusFlow,
  DirectusOperation,
  DirectusPermission,
  createItem,
  readItems,
  updateItem,
} from "@directus/sdk";
import { compareVersions } from "compare-versions";
import {
  DirectusCollection,
  DirectusField,
  DirectusRelation,
  DirectusRole,
  NestedPartial,
} from "@directus/sdk";
import { createOrUpdateDirectusRole } from "./directusQueries";
import ExtensionsSchema from "../schema/extensions";
import { ExtensionConfig } from "./extensions";

export interface ExtensionSchema {
  collections: NestedPartial<DirectusCollection<any>>[];
  fields: NestedPartial<DirectusField<any>>[];
  relations: NestedPartial<DirectusRelation<any>>[];
  roles: NestedPartial<DirectusRole<any>>[];
  permissions: NestedPartial<DirectusPermission<any>>[];
  flows: NestedPartial<DirectusFlow<any>>[];
  operations: NestedPartial<DirectusOperation<any>>[];
  custom: (() => Promise<void>)[];
}

export function initSchema(): ExtensionSchema {
  return {
    collections: [],
    fields: [],
    relations: [],
    roles: [],
    permissions: [],
    flows: [],
    operations: [],
    custom: [],
  } as ExtensionSchema;
}

export function combineSchemas(...schemas: ExtensionSchema[]) {
  const combinedSchema = initSchema();
  for (const schema of schemas) {
    combinedSchema.collections.push(...schema.collections);
    combinedSchema.fields.push(...schema.fields);
    combinedSchema.roles.push(...schema.roles);
    combinedSchema.relations.push(...schema.relations);
    combinedSchema.permissions.push(...schema.permissions);
    combinedSchema.flows.push(...schema.flows);
    combinedSchema.operations.push(...schema.operations);
    combinedSchema.custom.push(...schema.custom);
  }
  return combinedSchema;
}

// Apply extension configs to db
export async function applyExtensionConfigs(
  exts: ExtensionConfig[],
  force?: boolean,
  createExampleData?: boolean
) {
  const extsDb = await getExtensionsFromDb();
  for (const ext of exts) {
    await applyExtensionConfig(ext, extsDb, force);
  }
  if (createExampleData) {
    logger.info("Creating example data");
    for (const ext of exts) {
      if (ext.exampleDataFn) {
        await ext.exampleDataFn();
      }
    }
  }
  logger.info("All schemas applied successfully");
}

// Apply config for a single extension
async function applyExtensionConfig(
  ext: ExtensionConfig,
  extsDb: any[],
  force: boolean = false
) {
  const directus = await useDirectus();
  logger.info(`Applying schema of ${ext.name} v${ext.version}`);
  // Get data of current extension from db
  var extensionDb = extsDb.find((f) => f.name === ext.name);

  // Register extension if not found in db
  if (!extensionDb) {
    extensionDb = await directus.request(
      createItem("collectivo_extensions", {
        name: ext.name,
        version: "0.0.0",
      })
    );
  }

  // Apply schema if not applied
  if (force || compareVersions(ext.version, extensionDb.version) > 0) {
    checkDependencies(ext, extsDb);
    if (ext.schemas) {
      for (const schema of ext.schemas) {
        await applySchema(schema, ext.name);
      }
    }
    await directus.request(
      updateItem("collectivo_extensions", extensionDb.id, {
        version: ext.version,
      })
    );
  }
}

// Run the actual schema migration
async function applySchema(schema: ExtensionSchema, extension?: string) {
  for (const collection of schema.collections) {
    await createOrUpdateDirectusCollection(collection, [], [], extension);
  }
  for (const field of schema.fields) {
    if (!field.collection) {
      throw new Error("Field collection is required");
    }
    await createOrUpdateDirectusField(field, extension);
  }
  for (const relation of schema.relations) {
    await createOrUpdateDirectusRelation(relation);
  }
  for (const role of schema.roles) {
    await createOrUpdateDirectusRole(role);
  }
}

// Check if an extensions dependencies are met
function checkDependencies(ext: ExtensionConfig, extsDb: any[]): void {
  if (!ext.dependencies) return;
  for (const dep of ext.dependencies) {
    const depDb = extsDb.find((f) => f.name === dep.extensionName);
    if (!depDb || compareVersions(ext.version, depDb.version) >= 0) {
      throw new Error(
        `Dependency not met: ${dep.extensionName} must be at version ${dep.version}`
      );
    }
  }
}

// Load extensions from db or setup extension schema if it does not exist
async function getExtensionsFromDb(): Promise<Record<string, any>[]> {
  const directus = await useDirectus();
  try {
    const extensions = await directus.request(
      readItems("collectivo_extensions")
    );
    return extensions;
  } catch (e) {
    try {
      // Apply extension schema if not found
      await applySchema(ExtensionsSchema);
      // TODO: add extension collection to collectivo extension
    } catch (e2) {
      logger.error(e);
      logger.error(e2);
      throw Error("Error reading extensions from db");
    }
  }
  return Promise.resolve([]);
}

export async function createDirectusM2ARelation(
  schema: ExtensionSchema,
  aliasFieldName: string,
  MCollection: string,
  ACollections: string[],
  aliasField?: NestedPartial<DirectusField<any>>
) {
  const m2aCollection = `${MCollection}_${aliasFieldName}`;
  const m2aCollectionIdFieldName = `${MCollection}_id`;
  const field = aliasField || {
    field: aliasFieldName,
    type: "alias",
    meta: { interface: "list-m2a", special: ["m2a"] },
    collection: MCollection,
  };
  schema.fields.push(field);
  schema.collections.push({
    collection: m2aCollection,
    meta: { hidden: true, icon: "import_export" },
    schema: { schema: m2aCollection, name: m2aCollection, comment: null },
  });
  schema.fields.push({
    collection: m2aCollection,
    field: m2aCollectionIdFieldName,
    type: "integer",
    meta: { hidden: true },
  });
  schema.fields.push({
    collection: m2aCollection,
    field: "item",
    type: "string",
    schema: {},
    meta: { hidden: true },
  });
  schema.fields.push({
    collection: m2aCollection,
    field: "collection",
    type: "string",
    schema: {},
    meta: { hidden: true },
  });
  schema.relations.push({
    collection: m2aCollection,
    field: "item",
    meta: {
      one_field: null,
      sort_field: null,
      one_deselect_action: "nullify",
      // @ts-ignore
      one_allowed_collections: ACollections,
      one_collection_field: "collection",
      junction_field: m2aCollectionIdFieldName,
    },
  });
  schema.relations.push({
    collection: m2aCollection,
    field: m2aCollectionIdFieldName,
    related_collection: MCollection,
    meta: {
      one_field: aliasFieldName,
      sort_field: null,
      one_deselect_action: "nullify",
      junction_field: "item",
    },
    schema: { on_delete: "SET NULL" },
  });
}
