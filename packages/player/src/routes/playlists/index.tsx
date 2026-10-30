import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

import { PlaylistsView } from '../../views/Playlists';

export const Route = createFileRoute('/playlists/')({
  component: PlaylistsView,
  validateSearch: z.object({
    folder: z.string().optional(),
  }),
});
