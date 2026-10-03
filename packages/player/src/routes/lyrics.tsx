import { createFileRoute } from '@tanstack/react-router';

import { Lyrics } from '../views/Lyrics';

export const Route = createFileRoute('/lyrics')({
  component: Lyrics,
});
