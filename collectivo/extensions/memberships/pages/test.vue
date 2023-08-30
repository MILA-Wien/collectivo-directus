<template>
  <div class="text-rose-400">MEMBERSHIPS</div>
</template>

<script>
import { ref } from "vue";
import { thisIsTheKit } from "@collectivo/kit";

export default {
  setup() {
    console.log("This is the kit", thisIsTheKit);
    // expose to template and other options API hooks
    return {};
  },

  mounted() {
    console.log(this.count); // 0
  },
};
</script>
