const schema = initSchema();

schema.collections = [
  {
    collection: "collectivo_settings",
    schema: {
      schema: "schema",
      name: "schema",
      comment: null,
    },
    meta: {
      icon: "settings",
      sort: 1000,
      singleton: true,
      translations: [
        {
          language: "en-US",
          translation: "Settings",
          singular: "Settings",
          plural: "Settings",
        },
        {
          language: "de-DE",
          translation: "Einstellungen",
          singular: "Einstellungen",
          plural: "Einstellungen",
        },
      ],
    },
  },
];

schema.fields = [
  {
    field: "collectivo_project_name",
    collection: "collectivo_settings",
    type: "string",
    meta: {
      sort: 2,
      hidden: false,
      translations: [
        { language: "en-US", translation: "Project name" },
        { language: "de-DE", translation: "Projektname" },
      ],
    },
    schema: {
      default_value: "Collectivo",
    },
  },
  {
    field: "collectivo_project_description",
    collection: "collectivo_settings",
    type: "string",
    meta: {
      sort: 3,
      hidden: false,
      translations: [
        { language: "en-US", translation: "Project description" },
        { language: "de-DE", translation: "Projektbeschreibung" },
      ],
    },
  },
];

export default schema;
