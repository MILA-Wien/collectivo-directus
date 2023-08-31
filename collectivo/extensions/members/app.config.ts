import { IdentificationIcon } from "@heroicons/vue/24/solid";

export default defineAppConfig({
  mainMenuItems: {
    membership: {
      label: "Membership",
      link: "/membership/",
      icon: IdentificationIcon,
      filter: () => {
        // Use context for filter
        // const nuxtApp = useNuxtApp();
        return true;
      },
    },
  },
});
