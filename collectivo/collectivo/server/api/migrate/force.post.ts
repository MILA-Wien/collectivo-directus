// Run a specific migration for an extension, regardless of current state in db
export default defineEventHandler(async (event) => {
  console.log("Forcing migration");
  // Protect endpoint
  verifyCollectivoApiToken(event);
  await refreshDirectus();

  // Read parameters
  const query = getQuery(event);
  const extension = query["extension"];
  const version = query["version"] as string;
  const down = parseBoolean(query["down"], false);
  if (!extension) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing parameter 'ext'",
    });
  }
  if (!version) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing or invalid parameter 'id'",
    });
  }

  // Identify extension
  const exts = getRegisteredExtensions();
  const ext = exts.find((f: any) => f.name === extension);
  if (!ext) {
    throw createError({
      statusCode: 400,
      statusMessage: "Cannot find extension with name " + extension,
    });
  }

  // Run migration
  migrateCustom(ext, version, down);

  return {
    detail:
      "Forced migration " +
      version +
      " (down=" +
      down +
      ") for extension " +
      extension,
  };
});
