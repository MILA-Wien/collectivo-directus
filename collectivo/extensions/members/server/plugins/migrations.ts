import pkg from "../../package.json";

export default defineNitroPlugin((nitroApp) => {
  if (!useRuntimeConfig().runMigrations) {
    return;
  }
  const directus = useDirectus();
  // TODO: This calls 001 from core, not members
  // runMigrations();
});
