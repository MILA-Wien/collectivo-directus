export const directusStatusField = {
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

export const directusStatusFieldWithoutDraft = {
  field: "status",
  type: "string",
  meta: {
    width: "full",
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

export const directusSortField = {
  field: "sort",
  type: "integer",
  meta: { interface: "input", hidden: true },
  schema: {},
};

export const directusUserCreatedField = {
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

export const directusDateCreatedField = {
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

export const directusUserUpdatedField = {
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

export const directusDateUpdatedField = {
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

export const directusDefaultFields = [
  directusSortField,
  directusUserCreatedField,
  directusDateCreatedField,
  directusUserUpdatedField,
  directusDateUpdatedField,
];
