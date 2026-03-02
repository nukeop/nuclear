import { z } from 'zod';

const providerRefSchema = z.object({
  provider: z.string(),
  id: z.string(),
  url: z.string().optional(),
});

const artworkSchema = z.object({
  url: z.string(),
  width: z.number().optional(),
  height: z.number().optional(),
  purpose: z.enum(['avatar', 'cover', 'background', 'thumbnail']).optional(),
  source: providerRefSchema.optional(),
});

const artworkSetSchema = z.object({
  items: z.array(artworkSchema),
});

const artistCreditSchema = z.object({
  name: z.string(),
  roles: z.array(z.string()),
  source: providerRefSchema.optional(),
});

const trackSchema = z
  .object({
    title: z.string(),
    artists: z.array(artistCreditSchema),
    durationMs: z.number().optional(),
    source: providerRefSchema,
  })
  .passthrough();

const playlistItemSchema = z.object({
  id: z.string(),
  track: trackSchema,
  note: z.string().optional(),
  addedAtIso: z.string(),
});

export const PLAYLIST_EXPORT_VERSION = 1;

export const playlistSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  artwork: artworkSetSchema.optional(),
  tags: z.array(z.string()).optional(),
  createdAtIso: z.string(),
  lastModifiedIso: z.string(),
  origin: providerRefSchema.optional(),
  isReadOnly: z.boolean(),
  parentId: z.string().optional(),
  items: z.array(playlistItemSchema),
});

export const playlistExportSchema = z.object({
  version: z.number(),
  playlist: playlistSchema,
});

export const playlistIndexEntrySchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAtIso: z.string(),
  lastModifiedIso: z.string(),
  isReadOnly: z.boolean(),
  artwork: artworkSetSchema.optional(),
  itemCount: z.number(),
  totalDurationMs: z.number(),
  thumbnails: z.array(z.string()).default([]),
});

export const playlistIndexSchema = z.array(playlistIndexEntrySchema);

export const legacyTrackSchema = z.object({
  uuid: z.string().optional(),
  artist: z.string().optional(),
  name: z.string().optional(),
  album: z.string().optional(),
  thumbnail: z.string().optional(),
  duration: z
    .union([z.number(), z.string().transform(Number)])
    .refine((val) => Number.isFinite(val), { message: 'Invalid duration' })
    .optional(),
});

export const legacyPlaylistSchema = z.object({
  name: z.string(),
  tracks: z.array(legacyTrackSchema),
});

export const legacyConfigSchema = z
  .object({
    playlists: z.array(z.unknown()),
  })
  .refine(
    (config) =>
      config.playlists.some(
        (entry) => legacyPlaylistSchema.safeParse(entry).success,
      ),
    { message: 'No valid legacy playlists found' },
  );

export type LegacyTrack = z.infer<typeof legacyTrackSchema>;
export type LegacyPlaylist = z.infer<typeof legacyPlaylistSchema>;
