function convertBoolean(value: any, defaultValue?: boolean) {
  if (value === "true" || value === true) {
    return true;
  }
  if (value === "false" || value === false) {
    return false;
  }
  if (
    !defaultValue &&
    (value === "" || value === undefined || value === null)
  ) {
    return defaultValue;
  }
  throw createError({
    statusCode: 400,
    statusMessage: "Invalid parameter value '" + value + "'",
  });
}

// Run a specific migration for an extension, regardless of current state in db
export default defineEventHandler((event) => {
  // Protect endpoint
  verifyCollectivoApiToken(event);

  // Read parameters
  const query = getQuery(event);
  const extParam = query["ext"];
  const idParam = Number(query["id"]);
  const downParam = convertBoolean(query["down"], false);
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
  forceMigration(ext, idParam, downParam);

  return {
    detail:
      "Forced migration " +
      idParam +
      " (down=" +
      downParam +
      ") for extension " +
      extParam,
  };
});
