import { useParams } from '@tanstack/react-router';
import { FC, useMemo } from 'react';

import { CustomViewErrorBoundary } from '../../components/CustomViewErrorBoundary';
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

  const { route, params } = routeTable.match(_splat ?? '')!;
  const Page = route.component;
  return (
    <>
      <RuntimeTailwind />
      <CustomViewErrorBoundary registered={registered}>
        <Page params={params} api={registered.api} />
      </CustomViewErrorBoundary>
    </>
  );
};
