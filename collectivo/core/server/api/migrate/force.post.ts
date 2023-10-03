// Run a specific migration for an extension, regardless of current state in db
export default defineEventHandler((event) => {
  // Protect endpoint
  verifyCollectivoApiToken(event);

  // Read parameters
  const query = getQuery(event);
  const extParam = query["ext"];
  const idParam = Number(query["id"]);
  const upParam = Boolean(query["up"]);
  if (!extParam) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing parameter 'ext'",
    });
  }
  if (!idParam) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing or invalid parameter 'id'",
    });
  }

  // Identify extension
  const exts = getRegisteredExtensions();
  const ext = exts.find((f: any) => f.name === extParam);
  if (!ext) {
    throw createError({
      statusCode: 400,
      statusMessage: "Cannot find extension with name " + extParam,
    });
  }

  // Run migration
  forceMigration(ext, idParam, upParam);

  return {
    detail: "Forced migration " + idParam + " for extension " + extParam,
  };
});
