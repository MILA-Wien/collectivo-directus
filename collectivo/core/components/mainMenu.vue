<template>
  <div class="p-4 w-full flex flex-col gap-4">
    <div>Main Menu</div>
    <div v-for="item in menuItems">
      <div v-if="item.external">
        <a
          :href="item.link"
          :target="item.blank ?? true ? '_blank' : '_self'"
          >{{ item.label }}</a
        >
      </div>
      <div v-else>
        <component :is="item.icon" class="h-6 w-6 text-blue-500" />
        <NuxtLink :to="item.link">{{ item.label }}</NuxtLink>
      </div>
    </div>
    <div>
      <a
        href="http://localhost:8055/auth/login/keycloak?redirect=http://localhost:3000"
        >Login</a
      >
    </div>
    <div></div>
  </div>
</template>

<script setup lang="ts">
const appConfig = useAppConfig();
const menuItems = appConfig.mainMenuItems;
</script>
