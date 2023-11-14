// Run pending migrations for a set of extensions, based on current state in db
export default defineEventHandler(async (event) => {
  // Protect route with API Token
  verifyCollectivoApiToken(event);

  // Refresh Directus client
  await refreshDirectus();

  // Read parameters
  const query = getQuery(event);
  const createExampleData = parseBoolean(query["exampleData"], false);

  // Get extension configs
  const exts = getRegisteredExtensions();

  // Run migrations for all extensions
  migrateAll(exts, createExampleData);

  return {
    detail: "Running all migrations (exampleData = " + createExampleData + ")",
  };
});
