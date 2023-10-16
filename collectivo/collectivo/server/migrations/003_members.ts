import {
  DirectusCollection,
  DirectusField,
  NestedPartial,
  createRole,
  updateItem,
  deleteCollection,
  readSingleton,
  updateSingleton,
  readRoles,
  createPermission,
} from "@directus/sdk";

const migration = {
  id: 3,
  name: "003_members",
  description:
    "Members are the central entity of the plattform. They can be connected to a user account, but can also exist without an account.",
  up: createMembersAndTags,
  down: deleteMembersAndTags,
};

export default migration;

async function createMembersAndTags() {
  await createMembers();
  await createTags();
  await createMemberTagRelation();
  await createMemberFileRelations("visible");
  await createMemberFileRelations("hidden");
  await createMemberPermissions();
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
    {
      field: "first_name",
      type: "string",
      meta: {
        width: "half",
        sort: 1,
        require: true,
        translations: [
          { language: "en-US", translation: "First name" },
          { language: "de-DE", translation: "Vorname" },
        ],
      },
    },
    {
      field: "last_name",
      type: "string",
      meta: {
        width: "half",
        sort: 2,
        require: true,
        translations: [
          { language: "en-US", translation: "Last name" },
          { language: "de-DE", translation: "Nachname" },
        ],
      },
    },
    {
      field: "email",
      type: "string",
      schema: {
        is_unique: true,
      },
      meta: {
        sort: 3,
        width: "half",
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
        translations: [
          { language: "en-US", translation: "Email" },
          { language: "de-DE", translation: "Email" },
        ],
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
        sort: 4,
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
        sort: 5,
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
        sort: 50,
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
        display: "related-values",
        display_options: {
          template: "{{collectivo_tags_id.name}}",
        },
      },
    },
    {
      field: "notes",
      type: "text",
      schema: {},
      meta: {
        sort: 60,
        interface: "input-rich-text-md",
      },
      collection: "members_memberships",
    },
    {
      field: "files_visible",
      type: "alias",
      meta: {
        interface: "files",
        special: ["files"],
        sort: 70,
        note: "Files that are visible to the member.",
        translations: [
          { language: "en-US", translation: "Files (visible)" },
          { language: "de-DE", translation: "Dateien (sichtbar)" },
        ],
      },
    },
    {
      field: "files_hidden",
      type: "alias",
      note: "Files that are only visible to administrators.",
      meta: {
        interface: "files",
        sort: 71,
        special: ["files"],
        translations: [
          { language: "en-US", translation: "Files (hidden)" },
          { language: "de-DE", translation: "Dateien (versteckt)" },
        ],
      },
    },
    {
      field: "notes",
      type: "text",
      schema: {},
      meta: {
        sort: 60,
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

async function createMemberFileRelations(postfix: string) {
  const collection: NestedPartial<DirectusCollection<any>> = {
    collection: "collectivo_members_files_" + postfix,
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
      field: "directus_files_id",
      type: "uuid",
      schema: {},
      meta: { hidden: true },
    },
  ];

  const relations = [
    {
      collection: "collectivo_members_files_" + postfix,
      field: "directus_files_id",
      related_collection: "directus_files",
      meta: {
        one_field: null, // No field in files collection
        sort_field: null,
        one_deselect_action: "nullify",
        junction_field: "collectivo_members_id",
      },
      schema: { on_delete: "SET NULL" },
    },
    {
      collection: "collectivo_members_files_" + postfix,
      field: "collectivo_members_id",
      related_collection: "collectivo_members",
      meta: {
        one_field: "files_" + postfix,
        sort_field: null,
        one_deselect_action: "nullify",
        junction_field: "directus_files_id",
      },
      schema: { on_delete: "SET NULL" },
    },
  ];

  await createOrUpdateDirectusCollection(collection, fields, relations);
}

// Allow reading own user/member data
async function createMemberPermissions() {
  const directus = await useDirectus();
  const membersRole = await getDirectusRoleByName("collectivo_member");

  await directus.request(
    createPermission({
      role: membersRole.id,
      collection: "collectivo_members",
      action: "read",
      permissions: { _and: [{ user: { id: { _eq: "$CURRENT_USER" } } }] },
      fields: "*",
    })
  );
  await directus.request(
    createPermission({
      role: membersRole.id,
      collection: "directus_users",
      action: "read",
      permissions: { _and: [{ id: { _eq: "$CURRENT_USER" } }] },
      // @ts-ignore
      fields: ["first_name", "last_name", "email", "id", "role"],
    })
  );
}

async function deleteMembersAndTags() {
  console.log("Deleting members");
  const directus = await useDirectus();

  await directus.request(deleteCollection("collectivo_members"));
  await directus.request(deleteCollection("collectivo_tags"));
  await directus.request(
    deleteCollection("collectivo_members_collectivo_tags")
  );
  await directus.request(deleteCollection("collectivo_members_files_visible"));
  await directus.request(deleteCollection("collectivo_members_files_hidden"));
}
