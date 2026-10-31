import { createFileRoute } from '@tanstack/react-router';

import { ViewOutlet } from '../../../../views/ViewOutlet';

export const Route = createFileRoute('/plugin/$pluginId/$viewId/$')({
  component: ViewOutlet,
});
