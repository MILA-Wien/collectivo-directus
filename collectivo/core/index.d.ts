import { FunctionalComponent } from "vue";
import { DirectusUser } from "@directus/sdk";

declare global {
  // Server side migration types
  interface CollectivoMigrationDependency {
    name: string;
    id: number;
  }

  interface CollectivoMigration {
    up: () => Promise<void>;
    down: () => Promise<void>;
    dependencies?: CollectivoMigrationDependency[];
  }

  // Directus schema types
  interface CoreMenuItem {
    label: string;
    link?: string;
    icon?: FunctionalComponent;
    external?: boolean;
    target?: string;
    children?: CoreMenuItem[];
    order?: number; // Defaults to 100
    filter?: (item: CoreMenuItem) => boolean;
  }

  interface CoreExtension {
    id: number;
    core_name: string;
    core_version: string;
    core_migration: number;
  }

  interface CoreTile {
    id: number;
    core_name: string;
    core_content: string;
  }

  interface CoreTag {
    id: number;
    core_name: string;
    core_color: string;
  }

  interface CoreCurrentUser {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    core_tags: CoreTag[];
  }

  interface CoreSchema {
    core_extensions: CoreExtension[];
    core_tiles: CoreTile[];
    core_tags: CoreTag[];
    directus_users: CoreUser[];
  }
}

// Types for input of app.config.ts
declare module "nuxt/schema" {
  interface AppConfigInput {}
}

export {};
