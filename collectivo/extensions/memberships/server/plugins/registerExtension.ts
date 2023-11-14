import pkg from "../../package.json";
import m001_membersships from "../migrations/001_memberships";

// Register extension on startup
export default defineNitroPlugin((nitroApp) => {
  registerExtension({
    name: "memberships",
    description: pkg.description,
    version: pkg.version,
    migrations: [m001_membersships],
  });
});
