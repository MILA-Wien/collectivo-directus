import { FunctionalComponent } from "vue";

declare global {
  interface CollectivoMenu {
    [key: string]: CollectivoMenuItem;
  }

  interface CollectivoMenuItem {
    label: string;
    link?: string;
    linkFromRuntimeVar?: string;
    icon?: FunctionalComponent;
    external?: boolean;
    target?: string;
    children?: CollectivoMenuItem[];
    order?: number; // Defaults to 100
    requires_auth?: boolean;
    requires_role?: string;
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
