<template>
  <Head>
    <Title v-if="pageTitle == ''">{{ appConfig.projectName }}</Title>
    <Title v-else>{{ pageTitle }} - {{ appConfig.projectName }}</Title>
  </Head>
  <div id="collectivo-frame" class="flex h-screen bg-mila font-sans">
    <!-- Backdrop (when sidebar is open) -->
    <div
      :class="getSideBarOpen ? 'block' : 'hidden'"
      id="collectivo-backdrop"
      @click="toggleSideBar()"
      class="fixed inset-0 z-20 transition-opacity bg-black opacity-50 lg:hidden"></div>

    <!-- Sidebar -->
    <div
      :class="
        getSideBarOpen ? 'translate-x-0 ease-out' : '-translate-x-full ease-in'
      "
      class="fixed inset-y-0 left-0 z-30 w-60 overflow-y-auto scrollbar-hide transition duration-300 transform bg-white lg:translate-x-0 lg:static lg:inset-0"
      id="collectivo-sidebar">
      <MainMenu />
    </div>

    <!-- Main -->
    <div
      id="collectivo-main"
      class="flex-1 flex flex-col overflow-hidden default-layout bg-slate-300">
      <!-- Header -->
      <div class="w-full bg-slate-200 p-4">HEADER</div>

      <!-- Content -->
      <main class="flex-1 overflow-x-hidden overflow-y-auto">
        <div class="mx-auto h-full p-4">
          <slot> </slot>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
const appConfig = useAppConfig();
const pageTitle = usePageTitle();
const getSideBarOpen = ref(false);
function toggleSideBar() {
  menuStore.setSideBarOpen(getSideBarOpen.value ? false : true);
}
</script>
