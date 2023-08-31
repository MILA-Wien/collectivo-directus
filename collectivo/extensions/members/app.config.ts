import { BeakerIcon } from "@heroicons/vue/24/solid";

export default defineAppConfig({
  mainMenuItems: {
    membership: {
      label: "Membership",
      link: "/membership/",
      icon: BeakerIcon,
    },
  },
});
