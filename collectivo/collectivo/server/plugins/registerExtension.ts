import pkg from "../../package.json";
import extensionsSchema from "../schema/extensions";
import settingsSchema from "../schema/settings";
import createExampleData from "../exampleData/createExampleData";

// Register extension on startup
export default defineNitroPlugin((nitroApp) => {
  registerExtension({
    name: "collectivo",
    version: pkg.version,
    schemas: [extensionsSchema, settingsSchema],
    exampleDataFn: createExampleData,
  });
});
