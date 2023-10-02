import {
  DirectusCollection,
  DirectusField,
  NestedPartial,
  createItem,
} from "@directus/sdk";

const directusStatusField = {
  field: "status",
  type: "string",
  meta: {
    width: "full",
    options: {
      choices: [
        { text: "$t:published", value: "published" },
        { text: "$t:draft", value: "draft" },
        { text: "$t:archived", value: "archived" },
      ],
    },
    interface: "select-dropdown",
    display: "labels",
    display_options: {
      showAsDot: true,
      choices: [
        {
          text: "$t:published",
          value: "published",
          foreground: "#FFFFFF",
          background: "var(--primary)",
        },
        {
          text: "$t:draft",
          value: "draft",
          foreground: "#18222F",
          background: "#D3DAE4",
        },
        {
          text: "$t:archived",
          value: "archived",
          foreground: "#FFFFFF",
          background: "var(--warning)",
        },
      ],
    },
  },
  schema: { default_value: "draft", is_nullable: false },
};

const directusSortField = {
  field: "sort",
  type: "integer",
  meta: { interface: "input", hidden: true },
  schema: {},
};

const directusUserCreatedField = {
  field: "user_created",
  type: "uuid",
  meta: {
    special: ["user-created"],
    interface: "select-dropdown-m2o",
    options: {
      template: "{{avatar.$thumbnail}} {{first_name}} {{last_name}}",
    },
    display: "user",
    readonly: true,
    hidden: true,
    width: "half",
  },
  schema: {},
};

const directusDateCreatedField = {
  field: "date_created",
  type: "timestamp",
  meta: {
    special: ["date-created"],
    interface: "datetime",
    readonly: true,
    hidden: true,
    width: "half",
    display: "datetime",
    display_options: { relative: true },
  },
  schema: {},
};

const directusUserUpdatedField = {
  field: "user_updated",
  type: "uuid",
  meta: {
    special: ["user-updated"],
    interface: "select-dropdown-m2o",
    options: {
      template: "{{avatar.$thumbnail}} {{first_name}} {{last_name}}",
    },
    display: "user",
    readonly: true,
    hidden: true,
    width: "half",
  },
  schema: {},
};

const directusDateUpdatedField = {
  field: "date_updated",
  type: "timestamp",
  meta: {
    special: ["date-updated"],
    interface: "datetime",
    readonly: true,
    hidden: true,
    width: "half",
    display: "datetime",
    display_options: { relative: true },
  },
  schema: {},
};

const directusDefaultFields = [
  directusStatusField,
  directusSortField,
  directusUserCreatedField,
  directusDateCreatedField,
  directusUserUpdatedField,
  directusDateUpdatedField,
];

export async function up() {
  // Create or update extension collection
  logger.info("Migration TEMPLATE: up called");

  const collection: NestedPartial<DirectusCollection<any>> = {
    collection: "core_tags",
    schema: {
      schema: "schema",
      name: "schema",
      comment: null,
    },
    fields: directusDefaultFields,
    meta: {
      icon: "patient_list",
      // @ts-ignore
      sort: 3,
      archive_field: "status",
      archive_value: "archived",
      sort_field: "sort",
      unarchive_value: "draft",
      singleton: true,
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
    directusUserCreatedField,
    directusUserUpdatedField,
    directusDateCreatedField,
    directusDateUpdatedField,

    {
      collection: "core_tags",
      field: "core_child_tags",
      type: "integer",
      schema: {
        name: "core_child_tags",
        table: "core_tags",
        data_type: "integer",
        default_value: null,
        max_length: null,
        numeric_precision: null,
        numeric_scale: null,
        is_generated: false,
        generation_expression: null,
        is_nullable: true,
        is_unique: false,
        is_primary_key: false,
        has_auto_increment: false,
        foreign_key_column: "id",
        foreign_key_table: "core_tags",
      },
      meta: {
        id: 40,
        collection: "core_tags",
        field: "core_child_tags",
        special: null,
        interface: "select-dropdown-m2o",
        options: null,
        display: null,
        display_options: null,
        readonly: false,
        hidden: true,
        sort: 10,
        width: "full",
        translations: null,
        note: null,
        conditions: null,
        required: false,
        group: null,
        validation: null,
        validation_message: null,
      },
    },
    {
      collection: "core_tags",
      field: "name",
      type: "string",
      schema: {
        name: "name",
        table: "core_tags",
        data_type: "varchar",
        default_value: null,
        max_length: 255,
        numeric_precision: null,
        numeric_scale: null,
        is_generated: false,
        generation_expression: null,
        is_nullable: true,
        is_unique: false,
        is_primary_key: false,
        has_auto_increment: false,
        foreign_key_column: null,
        foreign_key_table: null,
      },
      meta: {
        id: 41,
        collection: "core_tags",
        field: "name",
        special: null,
        interface: "input",
        options: null,
        display: null,
        display_options: null,
        readonly: false,
        hidden: false,
        sort: 8,
        width: "full",
        translations: null,
        note: null,
        conditions: null,
        required: false,
        group: null,
        validation: null,
        validation_message: null,
      },
    },
    {
      collection: "core_tags",
      field: "core_parent_tags",
      type: "alias",
      schema: null,
      meta: {
        id: 39,
        collection: "core_tags",
        field: "core_parent_tags",
        special: [Array],
        interface: "list-o2m-tree-view",
        options: [Object],
        display: "related-values",
        display_options: [Object],
        readonly: false,
        hidden: false,
        sort: 9,
        width: "full",
        translations: null,
        note: null,
        conditions: null,
        required: false,
        group: null,
        validation: null,
        validation_message: null,
      },
    },
  ];

  // These will be deleted
  const oldFields: string[] = [];

  await createOrUpdateDirectusCollection(collection, fields, oldFields);

  // const directus = await useDirectus();

  // directus.request(createItem("core_settings", {}));
}

export async function down() {
  // Create or update extension collection
  console.log("Migration 001_test: down called");
}
