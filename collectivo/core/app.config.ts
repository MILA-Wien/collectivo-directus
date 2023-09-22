import {
  HomeIcon,
  RectangleGroupIcon,
  UserCircleIcon,
} from "@heroicons/vue/24/solid";

// Careful, links should not end with a slash
export default defineAppConfig({
  projectName: "Collectivo",
  mainMenuItems: <CollectivoMenu>{
    home: {
      icon: HomeIcon,
      label: "Home",
      link: "/",
      order: 0,
    },
    profile: {
      icon: UserCircleIcon,
      label: "Profile",
      link: "/core/profile",
      order: 0,
    },
    admin: {
      label: "Admin App",
      external: true,
      icon: RectangleGroupIcon,
      linkFromRuntimeVar: "directusUrl",
      requires_role: "core_admin",
      order: 99,
    },
  },
});
