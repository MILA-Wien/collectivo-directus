<template>
  <div>
    Installed extensions:
    <div v-if="error">Error: {{ error }}</div>
    <div v-else-if="extensions === null">Loading</div>
    <div v-else>
      <div v-for="extension in extensions" :key="extension.id">
        {{ extension.core_name }} - {{ extension.core_version }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();
const error = ref(null);
const extensions = useExtensions();
if (extensions.value === null) getExtensions().catch((e) => (error.value = e));
</script>
