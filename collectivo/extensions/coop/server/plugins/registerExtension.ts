import pkg from "../../package.json";
import m1 from "../migrations/001_members";

// Register extension on startup
export default defineNitroPlugin((nitroApp) => {
  registerExtension({
    name: "coop",
    description: pkg.description,
    version: pkg.version,
    migrations: [m1],
  });
});
