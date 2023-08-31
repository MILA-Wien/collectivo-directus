import { FunctionalComponent } from "vue";

declare global {
  interface CollectivoMenu {
    [key: string]: CollectivoMenuItem;
  }

  interface CollectivoMenuItem {
    label: string;
    link?: string;
    icon?: FunctionalComponent;
    external?: boolean;
    blank?: boolean;
    children?: CollectivoMenuItem[];
    filter?: () => boolean;
  }
}

declare module "nuxt/schema" {
  interface AppConfigInput {
    mainMenuItems?: CollectivoMenu;
  }
}

export {};
