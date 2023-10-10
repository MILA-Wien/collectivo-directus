<template>
  <div class="gap-5 columns-2">
    <div
      v-for="tile in tiles.data"
      class="border-solid border-2 border-sky-500 p-4 mb-5 inline-block w-full break-words">
      <div v-html="parse(tile.content)"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { readItems } from "@directus/sdk";
import { parse } from "marked";
const { t } = useI18n();
const currentUser = useCurrentUser();
const tiles = useTiles();
getTiles();
console.log(tiles.value.data);

const { $directus } = useNuxtApp();
async function test() {
  const x = await $directus?.request(readItems("collectivo_tiles"));
  console.log(x);
}
test();

// Fetch extensions from nuxt API
const registeredExtensions = ref<any>(null);
async function getRegisteredExtensions() {
  const response = await fetch("/api/extensions");
  const data = await response.json();
  registeredExtensions.value = data;
}
getRegisteredExtensions();
</script>
