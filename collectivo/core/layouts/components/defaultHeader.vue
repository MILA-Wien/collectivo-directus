<template>
  <div class="w-full bg-slate-200 p-4 font-bold">
    <client-only>{{ t(pageTitle) }}</client-only>
  </div>
</template>

<script setup>
const pageTitle = usePageTitle();
const { t } = useI18n();
</script>
