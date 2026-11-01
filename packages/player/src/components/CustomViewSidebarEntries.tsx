import { icons } from 'lucide-react';
import { FC } from 'react';

import { SidebarNavigationItem } from '@nuclearplayer/ui';

import { customViewPath } from '../services/viewsHost';
import { customViewKey, useCustomViewsStore } from '../stores/customViewsStore';

export const CustomViewSidebarEntries: FC = () => {
  const views = useCustomViewsStore((state) => state.views);

  return (
    <div data-testid="custom-view-sidebar-entries" className="contents">
      {Object.values(views).map(({ pluginId, view }) => {
        const Icon = icons[view.icon as keyof typeof icons];
        return (
          <SidebarNavigationItem
            key={customViewKey(pluginId, view.id)}
            to={customViewPath(pluginId, view.id)}
            icon={<Icon />}
            label={view.title}
          />
        );
      })}
    </div>
  );
};
