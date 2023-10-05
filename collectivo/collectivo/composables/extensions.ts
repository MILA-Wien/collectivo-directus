import { readItems } from "@directus/sdk";

export const useExtensions = () =>
  useState<CoreExtension[] | null>("core_extensions", () => null);

export const getExtensions = async () => {
  const { $directus } = useNuxtApp();
  const extensions = useExtensions();
  extensions.value =
    (await $directus?.request(readItems("core_extensions"))) || null;
  return extensions;
};
