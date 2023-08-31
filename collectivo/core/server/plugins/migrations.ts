import m001 from "../migrations/001";

export default defineNitroPlugin((nitroApp) => {
  if (!useRuntimeConfig().runMigrations) {
    return;
  }
  initMigrations(); // Sets up the migrations table in the database.
  console.log("done with init");
  runMigrations([m001]);
  console.log("done with run");
});
