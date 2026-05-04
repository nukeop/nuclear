import {
  type PluginInstallationMethod,
  type PluginRegistryEntry,
} from '../../services/plugins/pluginRegistry';

export class PluginRegistryEntryBuilder {
  private entry: PluginRegistryEntry = {
    id: 'default-plugin',
    version: '1.0.0',
    path: '/managed/default-plugin/1.0.0',
    installationMethod: 'store',
    enabled: true,
    installedAt: '2026-01-01T00:00:00.000Z',
    lastUpdatedAt: '2026-01-01T00:00:00.000Z',
  };

  withId(id: string): PluginRegistryEntryBuilder {
    this.entry.id = id;
    this.entry.path = `/managed/${id}/${this.entry.version}`;
    return this;
  }

  withVersion(version: string): PluginRegistryEntryBuilder {
    this.entry.version = version;
    this.entry.path = `/managed/${this.entry.id}/${version}`;
    return this;
  }

  withPath(path: string): PluginRegistryEntryBuilder {
    this.entry.path = path;
    return this;
  }

  withInstallationMethod(
    method: PluginInstallationMethod,
  ): PluginRegistryEntryBuilder {
    this.entry.installationMethod = method;
    return this;
  }

  withEnabled(enabled: boolean): PluginRegistryEntryBuilder {
    this.entry.enabled = enabled;
    return this;
  }

  withOriginalPath(originalPath: string): PluginRegistryEntryBuilder {
    this.entry.originalPath = originalPath;
    return this;
  }

  withWarnings(warnings: string[]): PluginRegistryEntryBuilder {
    this.entry.warnings = warnings;
    return this;
  }

  build(): PluginRegistryEntry {
    return { ...this.entry };
  }
}
