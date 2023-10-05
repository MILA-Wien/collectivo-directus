import { readItems } from "@directus/sdk";

export const useTiles = () =>
  useState<CoreTile[] | null>("core_tiles", () => null);

export const getTiles = async () => {
  const { $directus } = useNuxtApp();
  const tiles = useTiles();
  tiles.value = (await $directus?.request(readItems("core_tiles"))) || null;
  return tiles;
};
