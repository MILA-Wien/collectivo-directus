import m1 from "../migrations/001_test";

// Register extension on startup
export default defineNitroPlugin((nitroApp) => {
  registerExtension({
    name: "core",
    version: "0.0.1",
    migrations: [m1],
  });
});
