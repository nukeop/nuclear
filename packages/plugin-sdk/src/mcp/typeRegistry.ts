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

  PlaylistRef: {
    description: 'A lightweight reference to a playlist.',
    fields: {
      id: { type: 'string' },
      name: { type: 'string' },
      artwork: { type: 'ArtworkSet', optional: true },
      source: { type: 'ProviderRef' },
    },
  },

  PlaylistItem: {
    description: 'A track within a playlist.',
    fields: {
      id: { type: 'string' },
      track: { type: 'Track' },
      note: { type: 'string', optional: true },
      addedAtIso: { type: 'string' },
    },
  },

  Playlist: {
    description: 'A full playlist with metadata and items.',
    fields: {
      id: { type: 'string' },
      name: { type: 'string' },
      description: { type: 'string', optional: true },
      artwork: { type: 'ArtworkSet', optional: true },
      tags: { type: 'string[]', optional: true },
      createdAtIso: { type: 'string' },
      lastModifiedIso: { type: 'string' },
      origin: { type: 'ProviderRef', optional: true },
      isReadOnly: { type: 'boolean' },
      parentId: { type: 'string', optional: true },
      items: { type: 'PlaylistItem[]' },
    },
  },

  PlaylistIndexEntry: {
    description: 'Summary info for a playlist in the index.',
    fields: {
      id: { type: 'string' },
      name: { type: 'string' },
      createdAtIso: { type: 'string' },
      lastModifiedIso: { type: 'string' },
      isReadOnly: { type: 'boolean' },
      artwork: { type: 'ArtworkSet', optional: true },
      itemCount: { type: 'number' },
      totalDurationMs: { type: 'number' },
    },
  },

  SearchParams: {
    description: 'Parameters for a music search query.',
    fields: {
      query: { type: 'string' },
      types: {
        type: '"artists" | "albums" | "tracks" | "playlists"[]',
        optional: true,
        description: 'Categories to search',
      },
      limit: { type: 'number', optional: true },
    },
  },

  SearchResults: {
    description: 'Results from a music search, grouped by category.',
    fields: {
      artists: { type: 'ArtistRef[]', optional: true },
      albums: { type: 'AlbumRef[]', optional: true },
      tracks: { type: 'Track[]', optional: true },
      playlists: { type: 'PlaylistRef[]', optional: true },
    },
  },

  Album: {
    description: 'A full album with track listing and metadata.',
    fields: {
      title: { type: 'string' },
      artists: { type: 'ArtistCredit[]' },
      tracks: { type: 'TrackRef[]', optional: true },
      releaseDate: {
        type: 'ReleaseDate',
        optional: true,
        description: 'Release date with precision',
      },
      genres: { type: 'string[]', optional: true },
      artwork: { type: 'ArtworkSet', optional: true },
      source: { type: 'ProviderRef' },
    },
  },

  ReleaseDate: {
    description: 'A date with precision indicator.',
    fields: {
      precision: { type: '"year" | "month" | "day"' },
      dateIso: { type: 'string' },
    },
  },

  ArtistBio: {
    description: "An artist's biography, tags, and tour status.",
    fields: {
      name: { type: 'string' },
      disambiguation: { type: 'string', optional: true },
      bio: { type: 'string', optional: true },
      onTour: { type: 'boolean', optional: true },
      artwork: { type: 'ArtworkSet', optional: true },
      tags: { type: 'string[]', optional: true },
      source: { type: 'ProviderRef' },
    },
  },

  ArtistSocialStats: {
    description: "An artist's social media and platform statistics.",
    fields: {
      name: { type: 'string' },
      artwork: { type: 'ArtworkSet', optional: true },
      city: { type: 'string', optional: true },
      country: { type: 'string', optional: true },
      followersCount: { type: 'number', optional: true },
      followingsCount: { type: 'number', optional: true },
      trackCount: { type: 'number', optional: true },
      playlistCount: { type: 'number', optional: true },
      source: { type: 'ProviderRef' },
    },
  },

  PlaybackState: {
    description: 'Current audio playback state.',
    fields: {
      status: { type: '"playing" | "paused" | "stopped"' },
      seek: { type: 'number', description: 'Current position in seconds' },
      duration: { type: 'number', description: 'Total duration in seconds' },
    },
  },

  FavoriteEntry: {
    description:
      'A favorited item with timestamp. The ref field contains the actual entity (Track, AlbumRef, or ArtistRef).',
    fields: {
      ref: {
        type: 'Track | AlbumRef | ArtistRef',
        description: 'The favorited entity',
      },
      addedAtIso: { type: 'string' },
    },
  },

  AttributedResult: {
    description: 'A batch of results from a specific provider.',
    fields: {
      providerId: { type: 'string' },
      metadataProviderId: { type: 'string', optional: true },
      providerName: { type: 'string' },
      items: {
        type: 'any[]',
        description:
          'Array of result items (Track, ArtistRef, AlbumRef, or PlaylistRef depending on the endpoint)',
      },
    },
  },

  StreamResolutionResult: {
    description:
      'Result of resolving stream candidates for a track. Either succeeds with candidates or fails with an error.',
    fields: {
      success: { type: 'boolean' },
      candidates: {
        type: 'StreamCandidate[]',
        optional: true,
        description: 'Present when success is true',
      },
      error: {
        type: 'string',
        optional: true,
        description: 'Present when success is false',
      },
    },
  },

  ProviderDescriptor: {
    description:
      'Describes a registered provider (metadata, streaming, dashboard, etc.).',
    fields: {
      id: { type: 'string' },
      kind: {
        type: 'string',
        description:
          'Provider kind: metadata, streaming, lyrics, dashboard, etc.',
      },
      name: { type: 'string' },
      pluginId: { type: 'string', optional: true },
    },
  },

  YtdlpSearchResult: {
    description: 'A YouTube search result from yt-dlp.',
    fields: {
      id: { type: 'string', description: 'YouTube video ID' },
      title: { type: 'string' },
      duration: { type: 'number | null' },
      thumbnail: { type: 'string | null' },
    },
  },

  YtdlpStreamInfo: {
    description: 'A resolved YouTube audio stream from yt-dlp.',
    fields: {
      stream_url: { type: 'string' },
      duration: { type: 'number | null' },
      title: { type: 'string | null' },
      container: { type: 'string | null' },
      codec: { type: 'string | null' },
    },
  },

  QueueItemStateUpdate: {
    description: 'Partial update for a queue item status.',
    fields: {
      status: {
        type: '"idle" | "loading" | "success" | "error"',
        optional: true,
      },
      error: { type: 'string', optional: true },
    },
  },
};
