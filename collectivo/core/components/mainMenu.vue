<template>
  <div class="p-4 w-full flex flex-col gap-4">
    <div>Main Menu</div>
    <div v-for="item in menuItems">{{ item.label }}</div>
    <div>
      <a
        href="http://localhost:8055/auth/login/keycloak?redirect=http://localhost:3000"
        >Login</a
      >
    </div>
  </div>
</template>

<script setup lang="ts">
const appConfig = useAppConfig();
const menuItems = appConfig.mainMenuItems;
</script>
