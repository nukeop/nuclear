import { createFileRoute } from '@tanstack/react-router';

import { History } from '../views/History';

export const Route = createFileRoute('/history')({
  component: History,
});
