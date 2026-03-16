import { createFileRoute } from '@tanstack/react-router';

import { Sources } from '../views/Sources';

export const Route = createFileRoute('/sources')({
  component: Sources,
});
