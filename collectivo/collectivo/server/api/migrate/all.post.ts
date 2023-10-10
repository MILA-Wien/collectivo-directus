// Run pending migrations for a set of extensions, based on current state in db
export default defineEventHandler(async (event) => {
  // Protect route with API Token
  verifyCollectivoApiToken(event);
  await refreshDirectus();

  // Read parameters
  const query = getQuery(event);
  const createDemoData = parseBoolean(query["demo"], false);

  // Get extension configs
  const exts = getRegisteredExtensions();

  runAllMigrations(exts, createDemoData);

  return {
    detail: "Running all migrations (demo data = " + createDemoData + ")",
  };
});
