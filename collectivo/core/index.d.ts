declare global {
  interface CollectivoMenu {
    [key: string]: CollectivoMenuItem;
  }

  interface CollectivoMenuItem {
    label: string;
    link?: string;
    icon?: any;
    external?: boolean;
    blank?: boolean;
    children?: CollectivoMenuItem[];
    filter?: (item: CollectivoMenuItem) => boolean;
  }
}

declare module "nuxt/schema" {
  interface AppConfigInput {
    mainMenuItems?: CollectivoMenu;
  }
}

export {};
