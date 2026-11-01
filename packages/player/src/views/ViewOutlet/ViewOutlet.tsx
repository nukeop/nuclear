import { useParams } from '@tanstack/react-router';
import { FC, useMemo } from 'react';

import {
  customViewKey,
  useCustomViewsStore,
} from '../../stores/customViewsStore';
import { RuntimeTailwind } from './RuntimeTailwind';
import { ViewRouteTable } from './ViewRouteTable';

export const ViewOutlet: FC = () => {
  const { pluginId, viewId, _splat } = useParams({
    from: '/plugin/$pluginId/$viewId/$',
  });
  const registered = useCustomViewsStore(
    (state) => state.views[customViewKey(pluginId, viewId)],
  );
  const routeTable = useMemo(
    () => new ViewRouteTable(registered?.view.routes ?? []),
    [registered],
  );

  if (!registered) {
    return null;
  }

  const path = _splat ?? '';
  const match = routeTable.match(path);
  if (!match) {
    throw new Error(`The view has no route for "${path}"`);
  }

  const Page = match.route.component;
  return (
    <>
      <RuntimeTailwind />
      <Page params={match.params} api={registered.api} />
    </>
  );
};
