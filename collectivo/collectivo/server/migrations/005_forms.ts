import {
  DirectusCollection,
  DirectusField,
  NestedPartial,
  deleteCollection,
} from "@directus/sdk";
import { aw } from "@directus/sdk/dist/index-a2b3b0f1";

const migration = {
  id: 5,
  name: "005_forms",
  description: "Create forms collection for surveys and registration forms.",
  up: createFormsAll,
  down: deleteForms,
};

export default migration;

async function createFormsAll() {
  await createFormsElements();
  await createFormsSections();
  await createFormsPages();
  await createForms();
  await createFormsPagesRelation();
  await createFormsSectionsRelation();
  await createFormsElementsRelation();
}

async function deleteForms() {
  const directus = await useDirectus();
  await directus.request(deleteCollection("collectivo_forms"));
}

async function createFormsElements() {
  const collection: NestedPartial<DirectusCollection<any>> = {
    collection: "collectivo_forms_elements",
    schema: {
      schema: "schema",
      name: "schema",
      comment: null,
    },
    meta: {
      icon: "edit_note",
      // @ts-ignore
      sort: 30,
      group: "collectivo_forms",
      hidden: true,
      sort_field: "sort",
      display_template: "{{name}}",
      translations: [
        {
          language: "en-US",
          translation: "Form Elements",
          singular: "Form Element",
          plural: "Forms Elements",
        },
        {
          language: "de-DE",
          translation: "Formular Elemente",
          singular: "Formular Element",
          plural: "Formulare Elemente",
        },
      ],
    },
  };

  const fields: NestedPartial<DirectusField<any>>[] = [NAME_FIELD, SORT_FIELD];
  await createOrUpdateDirectusCollection(collection, fields);
}

async function createFormsSections() {
  const collection: NestedPartial<DirectusCollection<any>> = {
    collection: "collectivo_forms_sections",
    schema: {
      schema: "schema",
      name: "schema",
      comment: null,
    },
    meta: {
      icon: "edit_note",
      // @ts-ignore
      sort: 30,
      group: "collectivo_forms",
      hidden: true,
      sort_field: "sort",
      display_template: "{{name}}",
      translations: [
        {
          language: "en-US",
          translation: "Form Sections",
          singular: "Form Section",
          plural: "Forms Sections",
        },
        {
          language: "de-DE",
          translation: "Formular Sektionen",
          singular: "Formular Sektion",
          plural: "Formulare Sektionen",
        },
      ],
    },
  };

  const fields: NestedPartial<DirectusField<any>>[] = [
    NAME_FIELD,
    SORT_FIELD,
    {
      field: "collectivo_elements",
      type: "alias",
      meta: { interface: "list-m2m", special: ["m2m"] },
    },
  ];
  await createOrUpdateDirectusCollection(collection, fields);
}

async function createFormsPages() {
  const collection: NestedPartial<DirectusCollection<any>> = {
    collection: "collectivo_forms_pages",
    schema: {
      schema: "schema",
      name: "schema",
      comment: null,
    },
    meta: {
      icon: "edit_note",
      // @ts-ignore
      sort: 30,
      group: "collectivo_forms",
      hidden: true,
      sort_field: "sort",
      display_template: "{{name}}",
      translations: [
        {
          language: "en-US",
          translation: "Form Pages",
          singular: "Form Page",
          plural: "Forms Pages",
        },
        {
          language: "de-DE",
          translation: "Formular Seiten",
          singular: "Formular Seite",
          plural: "Formulare Seiten",
        },
      ],
    },
  };

  const fields: NestedPartial<DirectusField<any>>[] = [
    NAME_FIELD,
    SORT_FIELD,
    {
      field: "collectivo_sections",
      type: "alias",
      meta: { interface: "list-m2m", special: ["m2m"] },
    },
  ];
  await createOrUpdateDirectusCollection(collection, fields);
}

async function createForms() {
  const collection: NestedPartial<DirectusCollection<any>> = {
    collection: "collectivo_forms",
    schema: {
      schema: "schema",
      name: "schema",
      comment: null,
    },
    meta: {
      icon: "edit_note",
      // @ts-ignore
      sort: 30,
      archive_field: "status",
      archive_value: "archived",
      sort_field: "sort",
      unarchive_value: "published",
      translations: [
        {
          language: "en-US",
          translation: "Forms",
          singular: "Form",
          plural: "Forms",
        },
        {
          language: "de-DE",
          translation: "Formulare",
          singular: "Formular",
          plural: "Formulare",
        },
      ],
    },
  };

  const fields: NestedPartial<DirectusField<any>>[] = [
    NAME_FIELD,
    SORT_FIELD,
    STATUS_FIELD,
    ...DIRECTUS_SYSTEM_FIELDS,
    {
      field: "collectivo_action",
      type: "string",
      schema: {},
      meta: {
        interface: "select-dropdown",
        special: null,

        options: {
          choices: [
            {
              text: "$t:create_or_update_user_item",
              value: "create_or_update_user_item",
            },
          ],
          icon: "bolt",
          translations: [
            { language: "en-US", translation: "Action" },
            { language: "de-DE", translation: "Aktion" },
          ],
        },
      },
    },
    {
      field: "collectivo_pages",
      type: "alias",
      meta: { interface: "list-m2m", special: ["m2m"] },
    },
    // Permissions
    // M2M Form Actions
    // M2A Form sections/fields/etc.
  ];

  await createOrUpdateDirectusCollection(collection, fields);
}

async function createFormsPagesRelation() {
  const collection: NestedPartial<DirectusCollection<any>> = {
    collection: "collectivo_forms_collectivo_forms_pages",
    meta: { hidden: true, icon: "import_export" },
    schema: EMPTY_SCHEMA,
  };
  const fields = [
    {
      field: "collectivo_forms_id",
      type: "integer",
      schema: {},
      meta: { hidden: true },
    },
    {
      field: "collectivo_forms_pages_id",
      type: "integer",
      schema: {},
      meta: { hidden: true },
    },
    {
      field: "sort",
      type: "integer",
      schema: {},
      meta: { hidden: true },
    },
  ];
  const relations = [
    {
      collection: "collectivo_forms_collectivo_forms_pages",
      field: "collectivo_forms_pages_id",
      related_collection: "collectivo_forms_pages",
      meta: {
        one_field: null,
        sort_field: null,
        one_deselect_action: "nullify",
        junction_field: "collectivo_forms_id",
      },
      schema: { on_delete: "SET NULL" },
    },
    {
      collection: "collectivo_forms_collectivo_forms_pages",
      field: "collectivo_forms_id",
      related_collection: "collectivo_forms",
      meta: {
        one_field: "collectivo_pages",
        sort_field: "sort",
        one_deselect_action: "delete",
        junction_field: "collectivo_forms_pages_id",
      },
      schema: { on_delete: "CASCADE" },
    },
  ];
  await createOrUpdateDirectusCollection(collection, fields, relations);
}

async function createFormsSectionsRelation() {
  const collection: NestedPartial<DirectusCollection<any>> = {
    collection: "collectivo_forms_pages_collectivo_forms_sections",
    meta: { hidden: true, icon: "import_export" },
    schema: EMPTY_SCHEMA,
  };
  const fields = [
    {
      field: "collectivo_forms_pages_id",
      type: "integer",
      schema: {},
      meta: { hidden: true },
    },
    {
      field: "collectivo_forms_sections_id",
      type: "integer",
      schema: {},
      meta: { hidden: true },
    },
    {
      field: "sort",
      type: "integer",
      schema: {},
      meta: { hidden: true },
    },
  ];
  const relations = [
    {
      collection: "collectivo_forms_pages_collectivo_forms_sections",
      field: "collectivo_forms_sections_id",
      related_collection: "collectivo_forms_sections",
      meta: {
        one_field: null,
        sort_field: null,
        one_deselect_action: "nullify",
        junction_field: "collectivo_forms_pages_id",
      },
      schema: { on_delete: "SET NULL" },
    },
    {
      collection: "collectivo_forms_pages_collectivo_forms_sections",
      field: "collectivo_forms_pages_id",
      related_collection: "collectivo_forms_pages",
      meta: {
        one_field: "collectivo_sections",
        sort_field: "sort",
        one_deselect_action: "delete",
        junction_field: "collectivo_forms_sections_id",
      },
      schema: { on_delete: "CASCADE" },
    },
  ];
  await createOrUpdateDirectusCollection(collection, fields, relations);
}

async function createFormsElementsRelation() {
  const collection: NestedPartial<DirectusCollection<any>> = {
    collection: "collectivo_forms_sections_collectivo_forms_elements",
    meta: { hidden: true, icon: "import_export" },
    schema: EMPTY_SCHEMA,
  };
  const fields = [
    {
      field: "collectivo_forms_sections_id",
      type: "integer",
      schema: {},
      meta: { hidden: true },
    },
    {
      field: "collectivo_forms_elements_id",
      type: "integer",
      schema: {},
      meta: { hidden: true },
    },
    {
      field: "sort",
      type: "integer",
      schema: {},
      meta: { hidden: true },
    },
  ];
  const relations = [
    {
      collection: "collectivo_forms_sections_collectivo_forms_elements",
      field: "collectivo_forms_elements_id",
      related_collection: "collectivo_forms_elements",
      meta: {
        one_field: null,
        sort_field: null,
        one_deselect_action: "nullify",
        junction_field: "collectivo_forms_sections_id",
      },
      schema: { on_delete: "SET NULL" },
    },
    {
      collection: "collectivo_forms_sections_collectivo_forms_elements",
      field: "collectivo_forms_sections_id",
      related_collection: "collectivo_forms_sections",
      meta: {
        one_field: "collectivo_elements",
        sort_field: "sort",
        one_deselect_action: "delete",
        junction_field: "collectivo_forms_elements_id",
      },
      schema: { on_delete: "CASCADE" },
    },
  ];
  await createOrUpdateDirectusCollection(collection, fields, relations);
}
