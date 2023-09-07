<template>
  I AM THE DASHBOARD

  <div>
    Extensions:
    <div v-if="error">Error: {{ error }}</div>
    <div v-else-if="extensions === null">Loading</div>
    <div v-else>{{ extensions }}</div>
  </div>
</template>

<script setup>
import { readItems } from "@directus/sdk";
const { $directus } = useNuxtApp();
const extensions = ref(null);
const error = ref(null);

const fetchData = async () => {
  extensions.value = await $directus.request(readItems("core_extensions"));
};

fetchData().catch((e) => (error.value = e));
</script>
