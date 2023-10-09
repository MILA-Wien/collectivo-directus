// Run pending migrations for a set of extensions, based on current state in db
export default defineEventHandler((event) => {
  // Protect route with API Token
  verifyCollectivoApiToken(event);

  // Read parameters
  const query = getQuery(event);
  const createDemoData = convertBoolean(query["demo"], false);

  // Get extension configs
  const exts = getRegisteredExtensions();

  runAllMigrations(exts, createDemoData);

  return {
    detail: "Running all migrations (demo data = " + createDemoData + ")",
  };
});
