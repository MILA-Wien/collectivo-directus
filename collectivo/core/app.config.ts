export default defineAppConfig({
  bar: "base",
  baz: "base",
  baks: "base",
  array: () => ["base", "base", "base"],
  arrayNested: {
    nested: {
      array: ["base", "base", "base"],
    },
  },
});
