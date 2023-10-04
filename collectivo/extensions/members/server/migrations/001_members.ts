import {
  DirectusCollection,
  DirectusField,
  NestedPartial,
  createItem,
  createRelation,
  deleteCollection,
} from "@directus/sdk";

const migration = {
  up: createMembers,
  down: deleteMembers,
};

export default migration;

async function deleteMembers() {
  const directus = await useDirectus();
  await directus.request(deleteCollection("core_tags"));
}

async function createMembers() {
  const fields = [
    {
      field: "members_user",
      type: "uuid",
      schema: {},
      meta: {
        interface: "select-dropdown-m2o",
        special: ["m2o"],
        required: true,
        options: {
          template: "{{first_name}} {{last_name}}",
          enableCreate: false,
        },
      },
      collection: "members_members",
    },
  ];

  const relations = [
    {
      collection: "members_members",
      field: "members_user",
      related_collection: "directus_users",
      meta: { sort_field: null },
      schema: { on_delete: "SET NULL" },
    },
  ];
}
