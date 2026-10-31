import { useParams } from '@tanstack/react-router';
import { FC, useMemo } from 'react';

import {
  pluginViewKey,
  usePluginViewsStore,
} from '../../stores/pluginViewsStore';
import { ViewRouteTable } from './ViewRouteTable';

export const ViewOutlet: FC = () => {
  const { pluginId, viewId, _splat } = useParams({
    from: '/plugin/$pluginId/$viewId/$',
  });
  const registered = usePluginViewsStore(
    (state) => state.views[pluginViewKey(pluginId, viewId)],
  );
  const routeTable = useMemo(
    () => new ViewRouteTable(registered?.view.routes ?? []),
    [registered],
  );

  if (!registered) {
    return null;
  }

  const { route, params } = routeTable.match(_splat ?? '')!;
  const Page = route.component;
  return <Page params={params} api={registered.api} />;
};
