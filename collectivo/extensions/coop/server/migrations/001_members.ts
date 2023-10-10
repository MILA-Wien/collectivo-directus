import {
  DirectusCollection,
  DirectusField,
  NestedPartial,
  createTranslation,
} from "@directus/sdk";

const migration = {
  id: 1,
  name: "001_memberships",
  up: createMembers,
  down: deleteMembers,
};

export default migration;

async function deleteMembers() {
  // console.log("Deleting members");
  // const directus = await useDirectus();
  // // await directus.request(
  // //   deleteRelation("members_memberships", "members_user")
  // // );
  // await directus.request(deleteCollection("members_memberships"));
  // await directus.request(deleteCollection("members_membership_types"));
  // await directus.request(deleteCollection("members"));
}

async function createMembers() {
  const collection: NestedPartial<DirectusCollection<any>> = {
    collection: "collectivo_members",
  };

  const fields: NestedPartial<DirectusField<any>>[] = [
    {
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
      field: "coop_membership_type",
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
      field: "coop_date_applied",
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
      field: "coop_date_approved",
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
      field: "coop_date_cancelled",
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
      field: "coop_date_ended",
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
  await updateDirectusCollection(collection, fields);

  const translations = [
    { language: "de-DE", key: "active", value: "Aktiv" },
    { language: "de-DE", key: "investing", value: "Investierend" },
    { language: "de-DE", key: "applied", value: "Beworben" },
    { language: "de-DE", key: "approved", value: "Angenommen" },
    { language: "de-DE", key: "cancelled", value: "Ausgestiegen" },
    { language: "de-DE", key: "ended", value: "Beendet" },
  ];

  const directus = await useDirectus();
  try {
    directus.request(createTranslation(translations));
  } catch (error) {
    console.log(error);
  }
}
