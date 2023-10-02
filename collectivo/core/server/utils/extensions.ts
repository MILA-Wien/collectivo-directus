// Define extension setup function
export interface ExtensionConfig {
  extensionName: string;
  extensionVersion: string;
  dependencies?: string[];
  preMigrations?: () => any;
  migrations?: (() => any)[];
  postMigrations?: () => any;
}

// Shared variables between extensions
var extensionConfigs: ExtensionConfig[] = [];

export function useExtensionConfigs() {
  return extensionConfigs;
}

// Register extension and run setup and migration functions
export function registerExtension(ext: ExtensionConfig) {
  try {
    registerExtension_(ext);
  } catch (error) {
    logger.log({
      level: "error",
      message: `Error registering extension: ${ext.extensionName}`,
      error: error,
    });
  }
}

function registerExtension_(ext: ExtensionConfig) {
  // Check if setup should be run
  // This blocks extension dev servers as they have no .env file
  if (useRuntimeConfig().runMigrations !== true) {
    return;
  }

  // Check that extension name does not contain an underscore
  if (ext.extensionName.includes("_")) {
    throw new Error(
      `Extension name '${ext.extensionName}' should not contain underscores`
    );
  }

  // Check that extension version is a valid semver version
  if (!/^\d+\.\d+\.\d+$/.test(ext.extensionVersion)) {
    throw new Error(
      `Extension version '${ext.extensionVersion}' is not a valid semver version`
    );
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

  // Add setup to memory for dependency checks of upcoming setup functions
  extensionConfigs.push(ext);
}
