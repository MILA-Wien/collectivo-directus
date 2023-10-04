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
    Current user: {{ currentUser }}
  </div>
  <div>
    Available extensions (from nuxt API):
    {{ registeredExtensions.registeredExtensions }}
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();
const currentUser = useCurrentUser();
const error = ref(null);
const extensions = useExtensions();
if (extensions.value === null) getExtensions().catch((e) => (error.value = e));

// Fetch extensions from nuxt API
const registeredExtensions = ref<any>(null);
async function getRegisteredExtensions() {
  const response = await fetch("/api/extensions");
  const data = await response.json();
  registeredExtensions.value = data;
}
getRegisteredExtensions();
</script>
