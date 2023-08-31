import { RestClient, createCollection, createField } from "@directus/sdk";
export default {
  name: "collectivo-core-001",
  up: async (directus: RestClient<any>) => {
    console.log("Migrate up called.");
  },
  down: async () => {
    console.log("Migrate down called.");
  },
};
