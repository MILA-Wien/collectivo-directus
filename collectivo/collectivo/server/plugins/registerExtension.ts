import pkg from "../../package.json";

import extensionsSchema from "../schema/extensions";
import rolesSchema from "../schema/roles";
import settingsSchema from "../schema/settings";
import tilesSchema from "../schema/tiles";
import tagsSchema from "../schema/tags";

import createExampleData from "../exampleData/createExampleData";

// Register extension on startup
export default defineNitroPlugin((nitroApp) => {
  registerExtension({
    name: "collectivo",
    version: pkg.version,
    schemas: [
      extensionsSchema,
      rolesSchema,
      settingsSchema,
      tilesSchema,
      tagsSchema,
    ],
    exampleDataFn: createExampleData,
  });
});
