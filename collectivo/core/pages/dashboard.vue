<template>
  <div class="text-rose-400">
    MODULE TEST PAGE
    <a
      href="http://localhost:8055/auth/login/keycloak?redirect=http://localhost:3000"
      >Login</a
    >
    <p>
      <a class="cursor-pointer" @click="logOut()">Logout</a>
      <a class="cursor-pointer" @click="doNothing()">Do nothing</a>
    </p>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  setup() {
    const count = ref(0);

    function logOut() {
      // TODO This is not typed!
      const nuxtApp = useNuxtApp();
      const keycloak = nuxtApp.$keycloak;
      keycloak.logout();
    }

    function doNothing() {
      console.log("Do nothing");
    }

    // expose to template and other options API hooks
    return {
      count,
      logOut,
      doNothing,
    };
  },

  mounted() {
    console.log(this.count); // 0
  },
};
</script>
