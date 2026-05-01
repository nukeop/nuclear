import { AlertCircle, Package } from 'lucide-react';
import { FC, useMemo, useState } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import {
  Button,
  CenteredLoader,
  EmptyState,
  FilterChips,
  Input,
  PluginStoreItem,
  ScrollableArea,
} from '@nuclearplayer/ui';

import { MarketplacePlugin } from '../../apis/pluginMarketplaceApi';
import { useInstallPlugin } from '../../hooks/useInstallPlugin';
import { useMarketplacePlugins } from '../../hooks/useMarketplacePlugins';
import { usePluginStore } from '../../stores/pluginStore';

const CATEGORY_ALL = 'all';

const CATEGORIES = [
  'all',
  'streaming',
  'metadata',
  'lyrics',
  'scrobbling',
  'other',
] as const;

export const PluginStore: FC = () => {
  const { t } = useTranslation('plugins');
  const { data: plugins, isLoading, error, refetch } = useMarketplacePlugins();
  const { mutate: installPlugin, isPending, variables } = useInstallPlugin();
  const installedPlugins = usePluginStore((s) => s.plugins);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>(CATEGORY_ALL);

  const categoryItems = useMemo(
    () =>
      CATEGORIES.map((cat) => ({
        id: cat,
        label: t(`store.categories.${cat}`),
      })),
    [t],
  );

  const filteredPlugins = useMemo(() => {
    if (!plugins) {
      return [];
    }

    return plugins.filter((plugin) => {
      const pluginCategories: string[] =
        plugin.categories ?? (plugin.category ? [plugin.category] : []);
      const matchesCategory =
        category === CATEGORY_ALL || pluginCategories.includes(category);

      if (!search) {
        return matchesCategory;
      }

      const searchLower = search.toLowerCase();
      const matchesSearch =
        plugin.name.toLowerCase().includes(searchLower) ||
        plugin.description.toLowerCase().includes(searchLower) ||
        plugin.author.toLowerCase().includes(searchLower);

      return matchesCategory && matchesSearch;
    });
  }, [plugins, category, search]);

  const isPluginInstalled = (plugin: MarketplacePlugin) =>
    plugin.id in installedPlugins;

  const isPluginInstalling = (plugin: MarketplacePlugin) =>
    isPending && variables?.plugin.id === plugin.id;

  if (isLoading) {
    return <CenteredLoader />;
  }

  if (error) {
    return (
      <EmptyState
        icon={<AlertCircle size={48} />}
        title={t('store.error.title')}
        description={t('store.error.description')}
        action={
          <Button onClick={() => refetch()} size="sm">
            {t('store.error.retry')}
          </Button>
        }
      />
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-hidden">
      <div className="flex flex-col gap-3">
        <Input
          placeholder={t('store.searchPlaceholder')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <FilterChips
          items={categoryItems}
          selected={category}
          onChange={setCategory}
        />
      </div>

      {filteredPlugins.length === 0 ? (
        <EmptyState
          icon={<Package size={48} />}
          title={t('store.noResults.title')}
          description={
            search || category !== CATEGORY_ALL
              ? t('store.noResults.filtered')
              : t('store.noResults.empty')
          }
          size="sm"
        />
      ) : (
        <ScrollableArea className="flex-1 overflow-hidden">
          <div className="flex flex-col gap-3 px-2 py-2">
            {filteredPlugins.map((plugin) => (
              <PluginStoreItem
                key={plugin.id}
                name={plugin.name}
                description={plugin.description}
                author={plugin.author}
                category={plugin.category}
                categories={plugin.categories}
                isInstalled={isPluginInstalled(plugin)}
                isInstalling={isPluginInstalling(plugin)}
                onInstall={() => installPlugin({ plugin })}
                labels={{
                  install: t('store.install'),
                  installing: t('store.installing'),
                  installed: t('store.installed'),
                  by: t('store.by'),
                }}
              />
            ))}
          </div>
        </ScrollableArea>
      )}
    </div>
  );
};
