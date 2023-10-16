import {
  DirectusCollection,
  DirectusField,
  NestedPartial,
  createPermission,
  deleteCollection,
} from "@directus/sdk";

const migration = {
  id: 4,
  name: "004_tiles",
  up: createTiles,
  down: deleteTiles,
};

export default migration;

async function deleteTiles() {
  const directus = await useDirectus();
  await directus.request(deleteCollection("collectivo_tiles"));
}

async function createTiles() {
  const collection: NestedPartial<DirectusCollection<any>> = {
    collection: "collectivo_tiles",
    schema: {
      schema: "schema",
      name: "schema",
      comment: null,
    },
    meta: {
      icon: "dashboard",
      // @ts-ignore
      sort: 10,
      archive_field: "status",
      archive_value: "archived",
      sort_field: "sort",
      unarchive_value: "published",
      translations: [
        {
          language: "en-US",
          translation: "Tiles",
          singular: "Tile",
          plural: "Tiles",
        },
        {
          language: "de-DE",
          translation: "Kacheln",
          singular: "Kachel",
          plural: "Kacheln",
        },
      ],
    },
  };

  const fields: NestedPartial<DirectusField<any>>[] = [
    SORT_FIELD,
    STATUS_FIELD,
    ...DIRECTUS_SYSTEM_FIELDS,
    {
      field: "name",
      type: "string",
      schema: {
        is_nullable: false,
        is_unique: true,
      },
      meta: {
        sort: 2,
        required: true,
        translations: [
          { language: "en-US", translation: "Name" },
          { language: "de-DE", translation: "Name" },
        ],
      },
    },
    {
      field: "content",
      type: "text",
      schema: {},
      meta: {
        sort: 3,
        interface: "input-rich-text-md",
        options: {
          toolbar: [
            "heading",
            "bold",
            "italic",
            "strikethrough",
            "blockquote",
            "bullist",
            "numlist",
            "table",
            "code",
            "link",
            "empty",
          ],
          translations: [
            { language: "en-US", translation: "Content" },
            { language: "de-DE", translation: "Inhalt" },
          ],
        },
      },
    },
  ];

  await createOrUpdateDirectusCollection(collection, fields);

  // Allow reading tiles
  const directus = await useDirectus();
  const membersRole = await getDirectusRoleByName("collectivo_member");
  await directus.request(
    createPermission({
      role: membersRole.id,
      collection: "collectivo_tiles",
      action: "read",
      fields: "*",
      permissions: {},
      validation: {},
    })
  );
}
