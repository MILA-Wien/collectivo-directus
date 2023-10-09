import pkg from "../../package.json";
import m1 from "../migrations/001_memberships";

// Register extension on startup
export default defineNitroPlugin((nitroApp) => {
  registerExtension({
    name: "members",
    version: pkg.version,
    migrations: [m1],
  });
});