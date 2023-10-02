import { up as m1 } from "../migrations/001_test";
import { up as m2 } from "../migrations/002_settings";

// Register extension on startup
export default defineNitroPlugin((nitroApp) => {
  registerExtension({
    extensionName: "core",
    extensionVersion: "0.0.1",
    migrations: [m1],
  });
});
