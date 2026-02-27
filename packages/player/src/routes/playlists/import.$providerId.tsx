import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

import { PlaylistImport } from '../../views/PlaylistImport/PlaylistImport';

export const Route = createFileRoute('/playlists/import/$providerId')({
  component: PlaylistImport,
  validateSearch: z.object({
    url: z.string(),
  }),
});
