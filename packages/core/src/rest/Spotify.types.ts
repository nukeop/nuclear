// Helper Types & Common Interfaces

export interface CoverArtSource {
  height: number | null;
  url: string;
  width: number | null;
}

export interface ExtractedColorItem {
  hex: string;
  isFallback: boolean;
}

export interface ExtractedColors {
  colorDark: ExtractedColorItem;
}

export interface AlbumCoverArt {
  extractedColors: ExtractedColors;
  sources: CoverArtSource[];
}

export interface ArtistSimplified {
  profile: {
    name: string;
  };
  uri: string;
}

export interface AlbumDate {
  year: number;
}

export interface Playability {
  playable: boolean;
  reason: 'PLAYABLE';
}

export interface ReleaseDate {
  isoString: string;
  precision: 'MINUTE';
}

export interface ContentRating {
  label: 'NONE' | 'EXPLICIT';
}

export interface Duration {
  totalMilliseconds: number;
}

export interface AvatarImage {
  extractedColors: ExtractedColors;
  sources: CoverArtSource[];
}

export interface ArtistVisuals {
  avatarImage: AvatarImage;
}

export interface ArtistProfile {
  name: string;
  verified?: boolean;
}

export interface EpisodeCoverArt {
  extractedColors: ExtractedColors;
  sources: CoverArtSource[];
}

export interface PlayedState {
  playPositionMilliseconds: number;
  state: 'NOT_STARTED';
}

export interface EpisodeRestrictions {
  paywallContent: boolean;
}

export interface PodcastCoverArt {
  sources: CoverArtSource[];
  extractedColors?: ExtractedColors;
}

export interface PodcastPublisher {
  name: string;
}

export interface PlaylistAttribute {
  key: string;
  value: string;
}

export interface PlaylistImageItem {
  extractedColors: ExtractedColors;
  sources: CoverArtSource[];
}

export interface PlaylistImages {
  items: PlaylistImageItem[];
}

export interface UserAvatar {
  sources: CoverArtSource[];
  extractedColors?: ExtractedColors;
}

export interface AlbumOfTrack {
  coverArt: AlbumCoverArt;
  id: string;
  name: string;
  uri: string;
}

export interface AssociationsV3 {
  audioAssociations: { totalCount: number };
  videoAssociations: { totalCount: number };
}

export type ChipOrderTypeName =
  | 'TRACKS'
  | 'ARTISTS'
  | 'PLAYLISTS'
  | 'ALBUMS'
  | 'PODCASTS'
  | 'EPISODES'
  | 'USERS'
  | 'AUDIOBOOKS'
  | 'AUTHORS'
  | 'GENRES';

export interface ChipOrderItem {
  typeName: ChipOrderTypeName;
}

// __typename Interfaces

export interface Album {
  __typename: 'Album';
  artists: {
    items: ArtistSimplified[];
  };
  coverArt: AlbumCoverArt;
  date: AlbumDate;
  name: string;
  playability: Playability;
  type: 'ALBUM' | 'SINGLE' | 'EP';
  uri: string;
}

export interface Artist {
  __typename: 'Artist';
  profile: ArtistProfile;
  uri: string;
  visuals?: ArtistVisuals;
}

export interface PreReleaseContent {
  artists: {
    items: ArtistResponseWrapper[];
  };
  coverArt: AlbumCoverArt;
  name: string;
  type: 'ALBUM' | 'EP';
  uri: string;
}

export interface PreRelease {
  __typename: 'PreRelease';
  preReleaseContent: PreReleaseContent;
  preSaved: boolean;
  releaseDate: ReleaseDate;
  timezone: string;
  uri: string;
}

export interface PodcastTopic {
  __typename: 'PodcastTopic';
  title: string;
  uri: string;
}

export interface PodcastTopics {
  items: PodcastTopic[];
}

export interface Podcast {
  __typename: 'Podcast';
  coverArt: PodcastCoverArt;
  mediaType: 'MIXED' | 'AUDIO';
  name: string;
  publisher: PodcastPublisher;
  topics?: PodcastTopics;
  uri: string;
}

export interface Episode {
  __typename: 'Episode';
  contentRating: ContentRating;
  coverArt: EpisodeCoverArt;
  description: string;
  duration: Duration;
  mediaTypes: ('AUDIO' | 'VIDEO')[];
  name: string;
  playability: { reason: 'PLAYABLE' };
  playedState: PlayedState;
  podcastV2: PodcastResponseWrapper;
  releaseDate: ReleaseDate;
  restrictions: EpisodeRestrictions;
  uri: string;
}

export interface User {
  __typename: 'User';
  avatar: UserAvatar | null;
  name: string;
  uri: string;
  username: string;
  id?: string;
  displayName?: string;
}

type PlaylistFormat =
  | ''
  | 'editorial'
  | 'artistsets'
  | 'inspiredby-mix'
  | 'format-shows-shuffle';

export interface Playlist {
  __typename: 'Playlist';
  attributes: PlaylistAttribute[];
  description: string;
  format: PlaylistFormat;
  images: PlaylistImages;
  name: string;
  ownerV2: UserResponseWrapper;
  uri: string;
}

export interface Track {
  __typename: 'Track';
  albumOfTrack: AlbumOfTrack;
  artists: {
    items: ArtistSimplified[];
  };
  associationsV3: AssociationsV3;
  contentRating: ContentRating;
  duration: Duration;
  id: string;
  trackMediaType: 'UNKNOWN';
  name: string;
  playability: Playability;
  uri: string;
}

export interface NotFound {
  __typename: 'NotFound';
}

// Wrapper Interfaces

export interface AlbumResponseWrapper {
  __typename: 'AlbumResponseWrapper';
  data: Album;
}

export interface PreReleaseResponseWrapper {
  __typename: 'PreReleaseResponseWrapper';
  data: PreRelease;
}

export interface ArtistResponseWrapper {
  __typename: 'ArtistResponseWrapper';
  data: Artist;
}

export interface EpisodeResponseWrapper {
  __typename: 'EpisodeResponseWrapper';
  data: Episode;
}

export interface PodcastResponseWrapper {
  __typename: 'PodcastResponseWrapper';
  data: Podcast;
}

export interface PlaylistResponseWrapper {
  __typename: 'PlaylistResponseWrapper';
  data: Playlist;
}

export interface UserResponseWrapper {
  __typename: 'UserResponseWrapper';
  data: User;
}

export interface TrackResponseWrapper {
  __typename: 'TrackResponseWrapper';
  data: Track | NotFound;
}

// Page & Section Interfaces

export interface AlbumOrPrereleasePage {
  __typename: 'AlbumOrPrereleasePage';
  items: (AlbumResponseWrapper | PreReleaseResponseWrapper)[];
  totalCount: number;
}

export interface ChipOrder {
  items: ChipOrderItem[];
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
}

export interface SearchResultItemWrapper<T> {
  item: T;
}


export interface TopResultsV2 {
  featured: PlaylistResponseWrapper[];
  itemsV2: SearchResultItemWrapper<TrackResponseWrapper | ArtistResponseWrapper | PlaylistResponseWrapper>[];
}

// Main SearchV2 Structure

export interface SearchV2 {
  albumsV2: AlbumOrPrereleasePage;
  artists: PaginatedResponse<ArtistResponseWrapper>;
  chipOrder: ChipOrder;
  episodes: PaginatedResponse<EpisodeResponseWrapper>;
  playlists: PaginatedResponse<PlaylistResponseWrapper>;
  podcasts: PaginatedResponse<PodcastResponseWrapper>;
  topResultsV2: TopResultsV2;
  tracksV2: PaginatedResponse<SearchResultItemWrapper<TrackResponseWrapper>>;
  users: PaginatedResponse<UserResponseWrapper>;
}

// Root Response Object

export interface SpotifySearchV2Response {
  data: {
    searchV2: SearchV2;
  };
  extensions: {
    requestIds: {
      [key: string]: {
        [key: string]: string;
      };
    };
  };
}
