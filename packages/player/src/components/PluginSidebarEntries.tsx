import { icons } from 'lucide-react';
import { FC } from 'react';

import { SidebarNavigationItem } from '@nuclearplayer/ui';

import { pluginViewPath } from '../services/viewsHost';
import { pluginViewKey, usePluginViewsStore } from '../stores/pluginViewsStore';

export const PluginSidebarEntries: FC = () => {
  const views = usePluginViewsStore((state) => state.views);

  return (
    <div data-testid="plugin-sidebar-entries" className="contents">
      {Object.values(views).map(({ pluginId, view }) => {
        const Icon = icons[view.icon as keyof typeof icons];
        return (
          <SidebarNavigationItem
            key={pluginViewKey(pluginId, view.id)}
            to={pluginViewPath(pluginId, view.id)}
            icon={<Icon />}
            label={view.title}
          />
        );
      })}
    </div>
  );
};
