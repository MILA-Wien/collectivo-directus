import {
  DirectusCollection,
  DirectusField,
  NestedPartial,
  createItem,
  createRelation,
  deleteRelation,
  deleteCollection,
} from "@directus/sdk";

const migration = {
  id: 3,
  name: "003_members",
  description:
    "Members are the central entity of the plattform. They can be connected to a user account, but can also exist without an account.",
  up: createMembersAndTags,
  down: deleteMembers,
};

export default migration;

async function deleteMembers() {
  console.log("Deleting members");
  const directus = await useDirectus();
  // await directus.request(
  //   deleteRelation("members_memberships", "members_user")
  // );

  await directus.request(deleteCollection("collectivo_members"));
  await directus.request(deleteCollection("collectivo_tags"));
  await directus.request(
    deleteCollection("collectivo_members_collectivo_tags")
  );
}

async function createMembersAndTags() {
  console.log("Creating members and tags");
  await createMembers();
  await createTags();
  await createMemberTagRelation();
}

async function createMembers() {
  // Members ------------------------------------------------------------------

  const collection: NestedPartial<DirectusCollection<any>> = {
    collection: "collectivo_members",
    schema: {
      schema: "schema",
      name: "schema",
      comment: null,
    },
    meta: {
      icon: "switch_account",
      archive_field: "status",
      archive_value: "ended",
      unarchive_value: "draft",
      display_template: "{{first_name}} {{last_name}}",
      // @ts-ignore
      sort: 1,
      translations: [
        {
          language: "en-US",
          translation: "Members",
          singular: "Member",
          plural: "Members",
        },
        {
          language: "de-DE",
          translation: "Mitglieder",
          singular: "Mitglied",
          plural: "Mitglieder",
        },
      ],
    },
  };
  const fields = [
    ...DIRECTUS_SYSTEM_FIELDS,
    NOTES_FIELD,
    {
      field: "first_name",
      type: "string",
      meta: {
        width: "half",
        sort: 1,
        require: true,
      },
    },
    {
      field: "last_name",
      type: "string",
      meta: {
        width: "half",
        sort: 2,
        require: true,
      },
    },
    {
      field: "email",
      type: "string",
      schema: {
        is_unique: true,
      },
      meta: {
        interface: "input",
        sort: 3,
        with: "half",
        validation: {
          _and: [
            {
              email: {
                _regex:
                  "(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|\"(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21\\x23-\\x5b\\x5d-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])*\")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21-\\x5a\\x53-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])+)\\])",
              },
            },
          ],
        },
        validation_message: "Not a valid email address",
        options: { iconRight: "mail" },
      },
    },
    {
      field: "user",
      type: "uuid",
      schema: {
        is_unique: true,
        is_nullable: true,
      },
      meta: {
        interface: "select-dropdown-m2o",
        special: ["m2o"],
        width: "half",
        sort: 1,
        required: false,
        options: {
          template: "{{first_name}} {{last_name}}",
          enableCreate: false,
        },
        translations: [
          { language: "en-US", translation: "User" },
          { language: "de-DE", translation: "Benutzer*in" },
        ],
      },
    },
    {
      field: "status",
      type: "string",
      meta: {
        width: "half",
        sort: 2,
        options: {
          choices: [
            { text: "$t:draft", value: "draft" },
            { text: "$t:archived", value: "archived" },
          ],
        },
        interface: "select-dropdown",
        display: "labels",
      },
      schema: { default_value: "draft", is_nullable: false },
    },
    {
      field: "collectivo_tags",
      type: "alias",

      meta: {
        interface: "list-m2m",
        sort: 3,
        options: {
          layout: "table",
          enableSearchFilter: true,
          fields: ["collectivo_tags_id.name"],
        },
        special: ["m2m"],
        translations: [
          { language: "en-US", translation: "Tags" },
          { language: "de-DE", translation: "Tags" },
        ],
      },
    },
    {
      field: "notes",
      type: "text",
      schema: {},
      meta: {
        sort: 4,
        interface: "input-rich-text-md",
      },
      collection: "members_memberships",
    },
  ];

  const relations = [
    {
      collection: "collectivo_members",
      field: "user",
      related_collection: "directus_users",
      meta: { sort_field: null },
      schema: { on_delete: "NO ACTION" },
    },
  ];

  await createOrUpdateDirectusCollection(collection, fields, relations);
}

async function createTags() {
  const collection: NestedPartial<DirectusCollection<any>> = {
    collection: "collectivo_tags",
    schema: EMPTY_SCHEMA,
    meta: {
      icon: "sell",
      // @ts-ignore
      sort: 20,
      group: "collectivo_members",
      archive_field: "status",
      archive_value: "archived",
      unarchive_value: "published",
      display_template: "{{name}}",
      translations: [
        {
          language: "en-US",
          translation: "Tags",
          singular: "Tag",
          plural: "Tags",
        },
        {
          language: "de-DE",
          translation: "Tags",
          singular: "Tag",
          plural: "Tags",
        },
      ],
    },
  };

  const fields: NestedPartial<DirectusField<any>>[] = [
    NAME_FIELD,
    STATUS_FIELD_NO_DRAFT,
    ...DIRECTUS_SYSTEM_FIELDS,
    {
      field: "description",
      type: "text",
      schema: {},
      meta: { interface: "input-multiline", sort: 20 },
    },
    {
      field: "collectivo_members",
      type: "alias",
      meta: {
        special: ["m2m"],
        sort: 30,
        interface: "list-m2m",
        translations: [
          { language: "en-US", translation: "Assigned Members" },
          { language: "de-DE", translation: "Zugewiesene Mitglieder" },
        ],
        display: "related-values",
        display_options: {
          template:
            "{{collectivo_members_id.first_name}} {{collectivo_members_id.last_name}}",
        },
      },
    },
  ];

  await createOrUpdateDirectusCollection(collection, fields);
}

async function createMemberTagRelation() {
  const collection: NestedPartial<DirectusCollection<any>> = {
    collection: "collectivo_members_collectivo_tags",
    meta: { hidden: true, icon: "import_export" },
    schema: EMPTY_SCHEMA,
  };

  const fields = [
    {
      field: "collectivo_members_id",
      type: "integer",
      schema: {},
      meta: { hidden: true },
    },
    {
      field: "collectivo_tags_id",
      type: "integer",
      schema: {},
      meta: { hidden: true },
    },
  ];

  const relations = [
    {
      collection: "collectivo_members_collectivo_tags",
      field: "collectivo_tags_id",
      related_collection: "collectivo_tags",
      meta: {
        one_field: "collectivo_members",
        sort_field: null,
        one_deselect_action: "nullify",
        junction_field: "collectivo_members_id",
      },
      schema: { on_delete: "SET NULL" },
    },
    {
      collection: "collectivo_members_collectivo_tags",
      field: "collectivo_members_id",
      related_collection: "collectivo_members",
      meta: {
        one_field: "collectivo_tags",
        sort_field: null,
        one_deselect_action: "nullify",
        junction_field: "collectivo_tags_id",
      },
      schema: { on_delete: "SET NULL" },
    },
  ];

  await createOrUpdateDirectusCollection(collection, fields, relations);
}
