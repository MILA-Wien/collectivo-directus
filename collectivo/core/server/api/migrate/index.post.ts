// Run pending migrations for a set of extensions, based on current state in db
export default defineEventHandler((event) => {
  // Protect route with API Token
  verifyCollectivoApiToken(event);

  // Read parameters
  const query = getQuery(event);
  const extParam = query["ext"];
  const toParam = query["to"];
  if (!extParam) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing parameter 'ext'",
    });
  }
  if (toParam && typeof toParam !== "number") {
    throw createError({
      statusCode: 400,
      statusMessage: "Parameter 'to' must be a number",
    });
  }

  // Get extension configs
  const exts = getRegisteredExtensions();

  // Case 1: Migrate all extensions
  if (extParam == "all") {
    if (toParam) {
      throw createError({
        statusCode: 400,
        statusMessage: "Parameter 'to' is not possible when migrating all",
      });
    }
    runAllMigrations(exts);
    return {
      detail: "Running all migrations",
    };
  }

  // Case 2: Migrate a specific extension
  const ext = exts.find((f: any) => f.extensionName === extParam);
  if (!ext) {
    throw createError({
      statusCode: 400,
      statusMessage: "Cannot find extension with name " + extParam,
    });
  }
  runMigrations(ext, toParam as number | undefined);

  return {
    detail: "Running migrations for extension " + extParam,
  };
});
