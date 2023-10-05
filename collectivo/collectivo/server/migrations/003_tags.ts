import {
  DirectusCollection,
  DirectusField,
  NestedPartial,
  deleteCollection,
} from "@directus/sdk";

const migration = {
  id: 3,
  name: "003_tags",
  up: createTags,
  down: deleteTags,
};

export default migration;

async function deleteTags() {
  const directus = await useDirectus();
  await directus.request(deleteCollection("collectivo_tags"));
}

async function createTags() {
  const collection: NestedPartial<DirectusCollection<any>> = {
    collection: "collectivo_tags",
    schema: {
      schema: "schema",
      name: "schema",
      comment: null,
    },
    meta: {
      icon: "sell",
      // @ts-ignore
      sort: 20,
      archive_field: "status",
      archive_value: "archived",
      unarchive_value: "published",
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
    STATUS_FIELD_NO_DRAFT,
    ...DIRECTUS_SYSTEM_FIELDS,
    {
      field: "collectivo_name",
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
    },
  ];

  await createOrUpdateDirectusCollection(collection, fields);
}
