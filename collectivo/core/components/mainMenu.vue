<template>
  <div class="p-4 w-full flex flex-col gap-4">
    <div>Main Menu</div>
    <div v-for="item in menuItems">
      <div v-if="item.filter ? item.filter() : true">
        <div v-if="item.external">
          <a
            :href="item.link"
            :target="item.blank ?? true ? '_blank' : '_self'"
            >{{ item.label }}</a
          >
        </div>
        <div v-else>
          <NuxtLink :to="item.link"
            ><component :is="item.icon" class="h-5 w-5" />
            {{ $t(item.label) }}
          </NuxtLink>
        </div>
      </div>
    </div>
    <div>
      <a
        href="http://localhost:8055/auth/login/keycloak?redirect=http://localhost:3000"
        >Login</a
      >
    </div>
  </div>
  <div>
    <form>
      <select v-model="locale">
        <option value="en">en</option>
        <option value="de">de</option>
      </select>
      <p>{{ $t("Welcome") }}</p>
    </form>
  </div>
</template>

<script setup lang="ts">
const { locale } = useI18n();
const appConfig = useAppConfig();
const menuItems = appConfig.mainMenuItems;
</script>
