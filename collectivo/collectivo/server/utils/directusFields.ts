export const NAME_FIELD = {
  field: "name",
  type: "string",
  schema: {
    is_nullable: false,
    is_unique: true,
  },
  meta: {
    required: true,
    translations: [
      { language: "en-US", translation: "Name" },
      { language: "de-DE", translation: "Name" },
    ],
  },
};

export const DESCRIPTION_FIELD = {
  field: "description",
  type: "text",
  schema: {},
  meta: { interface: "input-multiline", special: null },
};

export const NOTES_FIELD = {
  field: "notes",
  type: "text",
  schema: {},
  meta: {
    interface: "input-rich-text-md",
  },
  collection: "members_memberships",
};

export const STATUS_FIELD = {
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
    sort: 10,
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

export const STATUS_FIELD_NO_DRAFT = {
  field: "status",
  type: "string",
  meta: {
    width: "full",
    sort: 10,
    options: {
      choices: [
        { text: "$t:published", value: "published" },
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
          text: "$t:archived",
          value: "archived",
          foreground: "#FFFFFF",
          background: "var(--warning)",
        },
      ],
    },
  },
  schema: { default_value: "published", is_nullable: false },
};

// System fields

export const SORT_FIELD = {
  field: "sort",
  type: "integer",
  meta: { interface: "input", hidden: true, sort: 105 },
  schema: {},
};

export const USER_CREATED_FIELD = {
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
    sort: 101,
  },
  schema: {},
};

export const DATE_CREATED_FIELD = {
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
    sort: 102,
  },
  schema: {},
};

export const USER_UPDATED_FIELD = {
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
    sort: 103,
  },
  schema: {},
};

export const DATE_UPDATED_FIELD = {
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
    sort: 104,
  },
  schema: {},
};

export const DIRECTUS_SYSTEM_FIELDS = [
  USER_CREATED_FIELD,
  USER_UPDATED_FIELD,
  DATE_CREATED_FIELD,
  DATE_UPDATED_FIELD,
];
