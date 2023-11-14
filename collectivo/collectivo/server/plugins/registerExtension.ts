import pkg from "../../package.json";

import m001_extensions from "../migrations/001_extensions";
// import rolesSchema from "../schema/roles";
// import settingsSchema from "../schema/settings";
// import tilesSchema from "../schema/tiles";
// import tagsSchema from "../schema/tags";
// import messagesSchema from "../schema/messages";

import createExampleData from "../exampleData/createExampleData";

// Register extension on startup
export default defineNitroPlugin((nitroApp) => {
  registerExtension({
    name: "collectivo",
    version: pkg.version,
    migrations: [m001_extensions],
    exampleDataFn: createExampleData,
  });
});
