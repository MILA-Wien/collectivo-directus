import { CollectivoMigration } from "./migrations";

// Define extension setup function
export interface ExtensionConfig {
  name: string;
  version: string;
  migrations?: CollectivoMigration[];
}

// To avoid name conflicts, the following extension names are forbidden
const FORBIDDEN_EXTENSION_NAMES = [
  "directus",
  "sort",
  "user",
  "date",
  "name",
  "notes",
  "migration",
  "description",
  "status",
];

// Store for registered extension configs
var registeredExtensions: ExtensionConfig[] = [];

export function getRegisteredExtensions() {
  return [...registeredExtensions];
}

// Register extension and run setup and migration functions
export function registerExtension(ext: ExtensionConfig) {
  try {
    registerExtension_(ext);
  } catch (error) {
    logger.log({
      level: "error",
      message: `Error registering extension: ${ext.name}`,
      error: error,
    });
  }
}

function registerExtension_(ext: ExtensionConfig) {
  // Check that extension name does not contain an underscore
  if (ext.name.includes("_")) {
    throw new Error(
      `Extension name '${ext.name}' should not contain underscores`
    );
  }

  // Check forbidden names
  if (FORBIDDEN_EXTENSION_NAMES.includes(ext.name)) {
    throw new Error(`Extension name '${ext.name}' is forbidden`);
  }

  // Check that extension version is a valid semver version
  if (!/^\d+\.\d+\.\d+$/.test(ext.version)) {
    throw new Error(
      `Extension version '${ext.version}' is not a valid semver version`
    );
  }

  // Check if extension is already registered in this server instance
  if (registeredExtensions.find((f) => f.name === ext.name)) {
    throw new Error(`Extension setup already run: ${ext.name}`);
  }

  // Add setup to memory for dependency checks of upcoming setup functions
  registeredExtensions.push(ext);
}
