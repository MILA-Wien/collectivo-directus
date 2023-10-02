export default defineEventHandler((event) => {
  checkApiTokenOrThrowError(event);
  const query = getQuery(event);
  const exts = useExtensionConfigs();
  const extParam = query["ext"];

  if (!extParam) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing parameter 'ext'",
    });
  }

  // Migrate all extensions
  if (extParam == "all") {
    runMigrations(exts, undefined);
    return {
      detail: "Running all migrations",
    };
  }

  // Migrate specific extension
  const ext = exts.find((f: any) => f.extensionName === extParam);
  const toParam = query["to"];
  if (!ext) {
    throw createError({
      statusCode: 400,
      statusMessage: "Cannot find extension with name " + extParam,
    });
  }
  if (toParam && typeof toParam !== "number") {
    throw createError({
      statusCode: 400,
      statusMessage: "Parameter 'to' must be a number",
    });
  }
  runMigrations([ext], toParam as number);

  return {
    detail: "Running migrations for extension " + extParam,
  };
});
