const migration = createMigration("memberships", "0.0.1", up, down);
export default migration;

async function up() {
  await applySchema(schema);
}

async function down() {
  // unapplySchema(schema);
}

const schema = initSchema();

schema.collections = [
  {
    collection: "memberships",
  },
];

schema.fields = [
  {
    collection: "memberships",
    field: "status",
    meta: {
      options: {
        choices: [
          { text: "$t:draft", value: "draft" },
          { text: "$t:applied", value: "applied" },
          { text: "$t:approved", value: "approved" },
          { text: "$t:cancelled", value: "cancelled" },
          { text: "$t:ended", value: "ended" },
        ],
      },
    },
  },
  {
    collection: "memberships",
    field: "memberships_type",
    type: "string",
    meta: {
      width: "half",
      sort: 6,
      options: {
        choices: [
          { text: "$t:active", value: "active" },
          { text: "$t:investing", value: "investing" },
        ],
      },
      interface: "select-dropdown",
      display: "labels",
      translations: [
        { language: "en-US", translation: "Type" },
        { language: "de-DE", translation: "Art" },
      ],
    },
    schema: { is_nullable: true },
  },
  {
    collection: "memberships",
    field: "memberships_date_applied",
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
    collection: "memberships",
    field: "memberships_date_approved",
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
    collection: "memberships",
    field: "memberships_date_cancelled",
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
    collection: "memberships",
    field: "memberships_date_ended",
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

schema.translations = [
  { language: "de-DE", key: "active", value: "Aktiv" },
  { language: "de-DE", key: "investing", value: "Investierend" },
  { language: "de-DE", key: "applied", value: "Beworben" },
  { language: "de-DE", key: "approved", value: "Angenommen" },
  { language: "de-DE", key: "cancelled", value: "Ausgestiegen" },
  { language: "de-DE", key: "ended", value: "Beendet" },
];

directusM2MRelation(schema, "directus_users", "memberships", {
  Collection2IsUUID: true,
  field1: {
    field: "directus_users",
    type: "alias",
    meta: {
      special: ["m2m"],
      sort: 30,
      interface: "list-m2m",
      translations: [
        { language: "en-US", translation: "Users" },
        { language: "de-DE", translation: "Benutzer*innen" },
      ],
      display: "related-values",
      display_options: {
        template:
          "{{directus_users_id.first_name}} {{directus_users_id.last_name}}",
      },
    },
  },
});
