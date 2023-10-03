import m1 from "../migrations/001_extensions";
import m2 from "../migrations/002_settings";

// Register extension on startup
export default defineNitroPlugin((nitroApp) => {
  registerExtension({
    name: "core",
    version: "0.0.1",
    migrations: [m1, m2],
  });
});
