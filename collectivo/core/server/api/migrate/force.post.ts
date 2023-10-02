export default defineEventHandler((event) => {
  checkApiTokenOrThrowError(event);
  const query = getQuery(event);
  const exts = useExtensionConfigs();
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

  const ext = exts.find((f: any) => f.extensionName === extParam);

  if (!ext) {
    throw createError({
      statusCode: 400,
      statusMessage: "Cannot find extension with name " + extParam,
    });
  }

  forceMigration(ext, idParam as number);

  return {
    detail:
      "Forcing migration " + String(idParam) + " for extension " + extParam,
  };
});
