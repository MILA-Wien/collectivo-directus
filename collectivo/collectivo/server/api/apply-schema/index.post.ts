// Run pending migrations for a set of extensions, based on current state in db
export default defineEventHandler(async (event) => {
  // Protect route with API Token
  verifyCollectivoApiToken(event);

  // Check if there is an authorized directus connection
  await refreshDirectus();

  // Read parameters
  const query = getQuery(event);
  const force = parseBoolean(query["force"], false);
  const createExampleData = parseBoolean(query["createExampleData"], false);

  // Apply extension configs
  const exts = getRegisteredExtensions();
  try {
    applyExtensionConfigs(exts, force, createExampleData);
  } catch (e) {
    logger.error(e);
    throw e;
  }
});
