<template>
  I AM THE DASHBOARD
  <form>
    <select v-model="locale">
      <option value="en">en</option>
      <option value="fr">fr</option>
    </select>
    <p>{{ $t("welcome") }}</p>
  </form>
  <!-- <div>
    Extensions:
    <div v-if="error">Error: {{ error }}</div>
    <div v-else-if="extensions === null">Loading</div>
    <div v-else>{{ extensions }}</div>
  </div> -->
</template>

<script setup>
// import { readItems } from "@directus/sdk";
const { locale } = useI18n();
// const { $directus } = useNuxtApp();
// const extensions = ref(null);
// const error = ref(null);

// const fetchData = async () => {
//   extensions.value = await $directus.request(readItems("core_extensions"));
//   console.log(extensions.value);
// };

// fetchData().catch((e) => (error.value = e));
// // extensions.value = $directus.request(readItems("core_extensions"));
// // console.log(extensions);
</script>
