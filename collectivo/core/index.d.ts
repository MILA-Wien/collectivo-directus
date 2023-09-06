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

  interface CollectivoCoreExtension {
    id: number;
    core_name: string;
    core_version: string;
    core_migration: number;
  }

  interface CollectivoCoreSchema {
    core_extensions: CollectivoCoreExtension[];
  }
}

declare module "nuxt/schema" {
  interface AppConfigInput {
    mainMenuItems?: CollectivoMenu;
  }
}

export {};
