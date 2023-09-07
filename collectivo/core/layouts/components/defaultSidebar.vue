<template>
  <div class="p-4 w-full flex flex-col gap-4">
    <div class="font-bold">{{ appConfig.projectName }}</div>
    <div v-for="item in sortedMenuItems">
      <div v-if="true">
        <div v-if="item.external">
          <a :href="getMenuLink(item)" :target="item.target ?? '_blank'">
            <div class="flex flex-row gap-2">
              <component :is="item.icon" class="h-5 w-5" />
              <div>{{ t(item.label) }}</div>
            </div>
          </a>
        </div>
        <div v-else>
          <NuxtLink :to="item.link">
            <div class="flex flex-row gap-2">
              <component :is="item.icon" class="h-5 w-5" />
              <div>{{ t(item.label) }}</div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
    <div>
      <a
        href="http://localhost:8055/auth/login/keycloak?redirect=http://localhost:3000"
        >Login Keycloak</a
      >
    </div>

    <div>
      <form>
        <select v-model="locale">
          <option value="en">en</option>
          <option value="de">de</option>
        </select>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t, locale } = useI18n();
const appConfig = useAppConfig();
const runtimeConfig = useRuntimeConfig();

const menuItems = appConfig.mainMenuItems;
const sortedMenuItems = Object.values(menuItems).sort(
  (a, b) => (a.order ?? 100) - (b.order ?? 100)
);

// Access runtime config vars to generate menu links based on .env
function getMenuLink(item: any): string {
  if (item.linkFromRuntimeVar) {
    return runtimeConfig.public[item.linkFromRuntimeVar] as string;
  }
  return item.link;
}
</script>
