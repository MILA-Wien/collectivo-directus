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
  id: 1,
  name: "001_memberships",
  up: createMembers,
  down: deleteMembers,
};

export default migration;

async function deleteMembers() {
  console.log("Deleting members");
  const directus = await useDirectus();
  // await directus.request(
  //   deleteRelation("members_memberships", "members_user")
  // );

  await directus.request(deleteCollection("members_memberships"));
  await directus.request(deleteCollection("members_membership_types"));
  await directus.request(deleteCollection("members"));
}

async function createMembers() {
  // Membership Types ---------------------------------------------------------

  const mtype_collection: NestedPartial<DirectusCollection<any>> = {
    collection: "members_membership_types",
    schema: {
      schema: "schema",
      name: "schema",
      comment: null,
    },
    meta: {
      icon: "switch_account",
      // @ts-ignore
      sort: 2,
      group: "collectivo_settings_folder",
      archive_field: "status",
      archive_value: "archived",
      unarchive_value: "published",
      display_template: "{{name}}",
      hidden: false,
      translations: [
        {
          language: "en-US",
          translation: "Membership Types",
          singular: "Membership Type",
          plural: "Membership Types",
        },
        {
          language: "de-DE",
          translation: "Mitgliedschaftsarten",
          singular: "Mitgliedschaftsart",
          plural: "Mitgliedschaftsarten",
        },
      ],
    },
  };

  const mtype_fields: NestedPartial<DirectusField<any>>[] = [
    NAME_FIELD,
    STATUS_FIELD,
    ...DIRECTUS_SYSTEM_FIELDS,
  ];

  await createOrUpdateDirectusCollection(mtype_collection, mtype_fields);

  // Memberships --------------------------------------------------------------

  const collection: NestedPartial<DirectusCollection<any>> = {
    collection: "members_memberships",
    schema: {
      schema: "schema",
      name: "schema",
      comment: null,
    },
    meta: {
      icon: "switch_account",
      // @ts-ignore
      sort: 1,
      archive_field: "status",
      archive_value: "ended",
      unarchive_value: "draft",
      translations: [
        {
          language: "en-US",
          translation: "Memberships",
          singular: "Membership",
          plural: "Memberships",
        },
        {
          language: "de-DE",
          translation: "Mitgliedschaften",
          singular: "Mitgliedschaft",
          plural: "Mitgliedschaften",
        },
      ],
    },
  };
  const fields = [
    ...DIRECTUS_SYSTEM_FIELDS,
    NOTES_FIELD,
    {
      field: "members_user",
      type: "uuid",
      schema: {},

      meta: {
        interface: "select-dropdown-m2o",
        special: ["m2o"],
        width: "half",
        sort: 1,
        required: true,
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
      field: "members_type",
      type: "uuid",
      schema: {},

      meta: {
        interface: "select-dropdown-m2o",
        special: ["m2o"],
        width: "half",
        sort: 2,
        required: true,
        options: {
          template: "{{name}}",
          enableCreate: false,
        },
        display: "related-values",
        display_options: {
          template: "{{name}}",
        },
        translations: [
          { language: "en-US", translation: "Type" },
          { language: "de-DE", translation: "Typ" },
        ],
      },
    },
    {
      field: "members_subtype",
      type: "string",
      meta: {
        width: "half",
        sort: 3,
        options: {
          choices: [],
        },
        interface: "select-dropdown",
        display: "labels",
        translations: [
          { language: "en-US", translation: "Subtype" },
          { language: "de-DE", translation: "Unterart" },
        ],
      },
      schema: { is_nullable: true },
    },
    {
      field: "status",
      type: "string",
      meta: {
        width: "half",
        sort: 4,
        options: {
          choices: [
            { text: "$t:draft", value: "draft" },
            { text: "$t:applied", value: "applied" },
            { text: "$t:approved", value: "approved" },
            { text: "$t:cancelled", value: "cancelled" },
            { text: "$t:ended", value: "ended" },
          ],
        },
        interface: "select-dropdown",
        display: "labels",
      },
      schema: { default_value: "draft", is_nullable: false },
    },
    {
      field: "members_date_applied",
      type: "date",
      schema: {},
      meta: {
        interface: "datetime",
        width: "half",
        translations: [
          { language: "de-DE", translation: "Datum Beworben" },
          { language: "en-US", translation: "Date Applied" },
        ],
      },
    },
    {
      field: "members_date_approved",
      type: "date",
      schema: {},
      meta: {
        interface: "datetime",
        width: "half",
        translations: [
          { language: "de-DE", translation: "Datum Angenommen" },
          { language: "en-US", translation: "Date Approved" },
        ],
      },
    },
    {
      field: "members_date_cancelled",
      type: "date",
      schema: {},
      meta: {
        interface: "datetime",
        width: "half",
        translations: [
          { language: "de-DE", translation: "Datum Austieg" },
          { language: "en-US", translation: "Date Cancelled" },
        ],
      },
    },
    {
      field: "members_date_ended",
      type: "date",
      schema: {},
      meta: {
        interface: "datetime",
        width: "half",
        translations: [
          { language: "de-DE", translation: "Datum Beendet" },
          { language: "en-US", translation: "Date Ended" },
        ],
      },
    },
  ];

  const relations = [
    {
      collection: "members_memberships",
      field: "members_user",
      related_collection: "directus_users",
      meta: { sort_field: null },
      schema: { on_delete: "NO ACTION" },
    },
    {
      collection: "members_memberships",
      field: "members_type",
      related_collection: "members_membership_types",
      meta: { sort_field: null },
      schema: { on_delete: "NO ACTION" },
    },
  ];

  await createOrUpdateDirectusCollection(collection, fields, relations);
}
