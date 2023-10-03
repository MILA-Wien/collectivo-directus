// Run a specific migration for an extension, regardless of current state in db
export default defineEventHandler((event) => {
  // Protect endpoint
  verifyCollectivoApiToken(event);

  // Read parameters
  const query = getQuery(event);
  const extParam = query["ext"];
  const idParam = query["id"];
  if (!extParam) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing parameter 'ext'",
    });
  }
  if (!idParam) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing parameter 'id'",
    });
  }
  if (typeof idParam !== "number") {
    throw createError({
      statusCode: 400,
      statusMessage: "Parameter 'id' must be a number",
    });
  }

  // Identify extension
  const exts = getRegisteredExtensions();
  const ext = exts.find((f: any) => f.extensionName === extParam);
  if (!ext) {
    throw createError({
      statusCode: 400,
      statusMessage: "Cannot find extension with name " + extParam,
    });
  }

  // Run migration
  forceMigration(ext, idParam as number);

  return {
    detail:
      "Forced migration " + String(idParam) + " for extension " + extParam,
  };
});
