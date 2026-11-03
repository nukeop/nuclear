import { createFileRoute } from '@tanstack/react-router';
import { FC } from 'react';

import { CustomViewErrorBoundary } from '../../../../components/CustomViewErrorBoundary';
import { customViewKey } from '../../../../stores/customViewsStore';
import { ViewOutlet } from '../../../../views/ViewOutlet';

const CustomViewRoutePage: FC = () => {
  const { pluginId, viewId } = Route.useParams();
  return (
    <CustomViewErrorBoundary
      key={customViewKey(pluginId, viewId)}
      pluginId={pluginId}
      viewId={viewId}
    >
      <ViewOutlet />
    </CustomViewErrorBoundary>
  );
};

export const Route = createFileRoute('/plugin/$pluginId/$viewId/$')({
  component: CustomViewRoutePage,
});
