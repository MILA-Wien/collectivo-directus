import pkg from "../../package.json";
import m1 from "../migrations/001_extensions";
import m2 from "../migrations/002_settings";
import m3 from "../migrations/003_members";
import m4 from "../migrations/004_tiles";
import createDemoData from "../demodata/createDemoData";

// Register extension on startup
export default defineNitroPlugin((nitroApp) => {
  registerExtension({
    name: "collectivo",
    version: pkg.version,
    migrations: [m1, m2, m3, m4],
    demoData: createDemoData,
  });
});
