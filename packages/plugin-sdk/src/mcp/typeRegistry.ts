export type TypeField = {
  type: string;
  optional?: boolean;
  description?: string;
};

export type TypeShape = {
  description: string;
  fields: Record<string, TypeField>;
};

export type TypeRegistry = Record<string, TypeShape>;

export const typeRegistry: TypeRegistry = {
  ProviderRef: {
    description:
      'A reference to an entity within a specific provider (e.g. a MusicBrainz artist, a YouTube video).',
    fields: {
      provider: { type: 'string', description: 'Provider identifier' },
      id: { type: 'string', description: 'Entity ID within the provider' },
      url: {
        type: 'string',
        optional: true,
        description: 'URL to the entity on the provider',
      },
    },
  },

  ArtistCredit: {
    description: 'A credited artist on a track or album, with roles.',
    fields: {
      name: { type: 'string' },
      roles: {
        type: 'string[]',
        description: 'e.g. ["performer", "composer"]',
      },
      source: { type: 'ProviderRef', optional: true },
    },
  },

  Artwork: {
    description: 'A single image at a specific size and purpose.',
    fields: {
      url: { type: 'string' },
      width: { type: 'number', optional: true },
      height: { type: 'number', optional: true },
      purpose: {
        type: '"avatar" | "cover" | "background" | "thumbnail"',
        optional: true,
      },
      source: { type: 'ProviderRef', optional: true },
    },
  },

  ArtworkSet: {
    description:
      'A collection of artwork images at different sizes and purposes.',
    fields: {
      items: { type: 'Artwork[]' },
    },
  },

  ArtistRef: {
    description: 'A lightweight reference to an artist entity.',
    fields: {
      name: { type: 'string' },
      disambiguation: { type: 'string', optional: true },
      artwork: { type: 'ArtworkSet', optional: true },
      source: { type: 'ProviderRef' },
    },
  },

  AlbumRef: {
    description: 'A lightweight reference to an album.',
    fields: {
      title: { type: 'string' },
      artists: { type: 'ArtistRef[]', optional: true },
      artwork: { type: 'ArtworkSet', optional: true },
      source: { type: 'ProviderRef' },
    },
  },

  TrackRef: {
    description:
      'A lightweight reference to a track (used in album track listings).',
    fields: {
      title: { type: 'string' },
      artists: { type: 'ArtistRef[]' },
      artwork: { type: 'ArtworkSet', optional: true },
      source: { type: 'ProviderRef' },
    },
  },

  LocalFileInfo: {
    description: 'Metadata about a local audio file.',
    fields: {
      fileUri: { type: 'string' },
      fileSize: { type: 'number', optional: true },
      format: { type: 'string', optional: true },
      bitrateKbps: { type: 'number', optional: true },
      sampleRateHz: { type: 'number', optional: true },
      channels: { type: 'number', optional: true },
      fingerprint: { type: 'string', optional: true },
      scannedAtIso: { type: 'string', optional: true },
    },
  },

  Stream: {
    description: 'A resolved audio stream URL with quality metadata.',
    fields: {
      url: { type: 'string' },
      protocol: { type: '"file" | "http" | "https" | "hls"' },
      mimeType: { type: 'string', optional: true },
      bitrateKbps: { type: 'number', optional: true },
      codec: { type: 'string', optional: true },
      container: { type: 'string', optional: true },
      qualityLabel: { type: 'string', optional: true },
      durationMs: { type: 'number', optional: true },
      contentLengthBytes: { type: 'number', optional: true },
      source: { type: 'ProviderRef' },
    },
  },

  StreamCandidate: {
    description:
      'A potential stream source for a track, possibly with a resolved stream.',
    fields: {
      id: { type: 'string' },
      title: { type: 'string' },
      durationMs: { type: 'number', optional: true },
      thumbnail: { type: 'string', optional: true },
      stream: { type: 'Stream', optional: true },
      lastResolvedAtIso: { type: 'string', optional: true },
      failed: { type: 'boolean' },
      source: { type: 'ProviderRef' },
    },
  },

  Track: {
    description:
      'A full track with metadata, artwork, and optional streaming info.',
    fields: {
      title: { type: 'string' },
      artists: { type: 'ArtistCredit[]' },
      album: { type: 'AlbumRef', optional: true },
      durationMs: { type: 'number', optional: true },
      trackNumber: { type: 'number', optional: true },
      disc: { type: 'string', optional: true },
      artwork: { type: 'ArtworkSet', optional: true },
      tags: { type: 'string[]', optional: true },
      source: { type: 'ProviderRef' },
      localFile: { type: 'LocalFileInfo', optional: true },
      streamCandidates: { type: 'StreamCandidate[]', optional: true },
    },
  },

  QueueItem: {
    description: 'A track in the playback queue with its loading status.',
    fields: {
      id: { type: 'string' },
      track: { type: 'Track' },
      status: { type: '"idle" | "loading" | "success" | "error"' },
      error: { type: 'string', optional: true },
      addedAtIso: { type: 'string' },
    },
  },

  Queue: {
    description: 'The playback queue state.',
    fields: {
      items: { type: 'QueueItem[]' },
      currentIndex: { type: 'number' },
      repeatMode: { type: '"off" | "all" | "one"' },
      shuffleEnabled: { type: 'boolean' },
    },
  },
};
