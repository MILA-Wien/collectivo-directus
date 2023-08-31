declare module "nuxt/schema" {
  interface MenuItem {
    label: string;
    link?: string;
    icon?: string;
    children?: MenuItem[];
  }

  interface AppConfigInput {
    mainMenuItems?: { [key: string]: MenuItem };
  }
}

export {};
