<template>
  <div>
    Index {{ x }}
    <Btn />
    <Corecomp />
    <Memberscomp />
  </div>
</template>

<script setup>
const x = "hello world";
const appConfig = useAppConfig();
console.log("app config", appConfig);
</script>
