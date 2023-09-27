import { up as m1 } from "../migrations/001_test";

export default defineNitroPlugin((nitroApp) => {
  // This will run every time the server starts
  registerExtension({
    extensionName: "core",
    preMigrations: corePreMigrations, // Run at server start before migrations
    migrations: [m1], // Run each migration only once
  });
});

async function corePreMigrations() {
  logger.info("Core Pre Migration Function called");
  //await createExtensionCollection();

  // Settings POST collection
  // {"data":{"collection":"core_settings","meta":{"collection":"core_settings","icon":null,"note":null,"display_template":null,"hidden":false,"singleton":true,"translations":null,"archive_field":null,"archive_app_filter":true,"archive_value":null,"unarchive_value":null,"sort_field":null,"accountability":"all","color":null,"item_duplication_fields":null,"sort":null,"group":null,"collapse":"open","preview_url":null},"schema":{"name":"core_settings","sql":"CREATE TABLE `core_settings` (`id` integer not null primary key autoincrement)"}}}

  // Create Logo field
  // POST Field Core Settings
  // http://localhost:8055/fields/core_settings
  // POST relations
  // {"data":{"collection":"core_settings","field":"logo","related_collection":"directus_files","schema":{"table":"core_settings","column":"logo","foreign_key_table":"directus_files","foreign_key_column":"id","on_update":"NO ACTION","on_delete":"SET NULL","constraint_name":null},"meta":{"id":3,"many_collection":"core_settings","many_field":"logo","one_collection":"directus_files","one_field":null,"one_collection_field":null,"one_allowed_collections":null,"junction_field":null,"sort_field":null,"one_deselect_action":"nullify"}}}
}
