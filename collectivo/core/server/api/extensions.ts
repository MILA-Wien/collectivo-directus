// Return list of registered extensions
export default defineEventHandler((event) => {
  checkApiTokenOrThrowError(event);
  const registeredExtensions = [];
  for (const ext of useExtensionConfigs()) {
    registeredExtensions.push({
      name: ext.extensionName,
      version: ext.extensionVersion,
      dependencies: ext.dependencies ?? [],
      availableMigrations: ext.migrations?.length ?? 0,
    });
  }
  return {
    registeredExtensions: registeredExtensions,
  };
});
