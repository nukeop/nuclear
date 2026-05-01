import type { NuclearPluginAPI } from './api';
import type { ProviderKind } from './types/providers';

export type PluginIcon = { type: 'link'; link: string };

export type PluginManifest = {
  name: string;
  version: string;
  description: string;
  author: string;
  main?: string;
  nuclear?: {
    displayName?: string;
    // TODO: Remove category after registry migration to categories
    category?: string;
    categories?: string[];
    providers?: ProviderKind[];
    icon?: PluginIcon;
    permissions?: string[];
  };
};

export type NuclearPlugin = {
  onLoad?(api: NuclearPluginAPI): void | Promise<void>;
  onUnload?(api: NuclearPluginAPI): void | Promise<void>;
  onEnable?(api: NuclearPluginAPI): void | Promise<void>;
  onDisable?(api: NuclearPluginAPI): void | Promise<void>;
};

export type PluginMetadata = {
  id: string;
  name: string;
  displayName: string;
  version: string;
  description: string;
  author: string;
  // TODO: Remove category after registry migration to categories
  category?: string;
  categories: string[];
  providers: ProviderKind[];
  icon?: PluginIcon;
  permissions: string[];
};

export type LoadedPlugin = {
  metadata: PluginMetadata;
  instance: NuclearPlugin;
  path: string;
};
