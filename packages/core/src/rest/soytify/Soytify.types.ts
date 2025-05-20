// Query parameters
export type OperationName =
  | 'searchDesktop'
  | 'searchArtists'
  | 'searchAlbums'
  | 'searchTracks'
  | 'searchPlaylists'
  | 'queryArtistOverview'
  | 'getAlbum';

// Helper Types & Common Interfaces
export interface AlbumCoverArt {
  extractedColors: ExtractedColors;
  sources: CoverArtSource[];
}
export interface AlbumDate {
  year: number;
}
export interface AlbumOfTrack {
  coverArt: AlbumCoverArt;
  id: string;
  name: string;
  uri: string;
}
export interface ArtistProfile {
  name: string;
  verified?: boolean;
}
export interface ArtistSimplified {
  profile: {
    name: string;
  };
  uri: string;
}
export interface ArtistVisuals {
  avatarImage: AvatarImage;
  gallery?: Gallery;
}
export interface AssociationsV3 {
  audioAssociations: { totalCount: number };
  videoAssociations: { totalCount: number };
}
export interface AvatarImage {
  extractedColors: ExtractedColors;
  sources: CoverArtSource[];
}
export interface ChipOrderItem {
  typeName: ChipOrderTypeName;
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
export interface ConcertLocation {
  city: string;
  name: string;
}
export interface ContentRating {
  label: 'NONE' | 'EXPLICIT';
}
export interface Copyright {
  items: CopyrightItem[];
}
export interface CopyrightItem {
  text: string;
  type: 'C' | 'P';
}
export interface CoverArtSource {
  height: number | null;
  url: string;
  width: number | null;
}
export interface Duration {
  totalMilliseconds: number;
}
export interface EpisodeCoverArt {
  extractedColors: ExtractedColors;
  sources: CoverArtSource[];
}
export interface EpisodeRestrictions {
  paywallContent: boolean;
}
export interface ExtractedColorItem {
  hex: string;
  isFallback: boolean;
}
export interface ExtractedColors {
  colorDark: ExtractedColorItem;
}
export interface FullDate {
  day: number;
  month: number;
  precision: 'DAY' | 'MONTH' | 'YEAR';
  year: number;
}
export interface PlayedState {
  playPositionMilliseconds: number;
  state: 'NOT_STARTED';
}
export interface Playability {
  playable: boolean;
  reason: 'PLAYABLE';
}
export interface PlaylistAttribute {
  key: string;
  value: string;
}
export type PlaylistFormat =
  | ''
  | 'editorial'
  | 'artistsets'
  | 'inspiredby-mix'
  | 'format-shows-shuffle';
export interface PlaylistImageItem {
  extractedColors: ExtractedColors;
  sources: CoverArtSource[];
}
export interface PlaylistImages {
  items: PlaylistImageItem[];
}
export interface PodcastCoverArt {
  sources: CoverArtSource[];
  extractedColors?: ExtractedColors;
}
export interface PodcastPublisher {
  name: string;
}
export interface PodcastTopics {
  items: PodcastTopic[];
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
export interface ReleaseDate {
  isoString: string;
  precision: 'MINUTE';
}
export type ReleaseType = 'ALBUM' | 'SINGLE' | 'EP' | 'COMPILATION';
export interface SharingInfo {
  shareId: string;
  shareUrl: string;
}
export interface TracksSummary {
  totalCount: number;
}
export interface UserAvatar {
  sources: CoverArtSource[];
  extractedColors?: ExtractedColors;
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
  id: string;
  uri: string;
  profile: ArtistProfile;
  headerImage: CoverArtSource | null;
  visuals?: ArtistVisuals;
  goods: Goods;
  discography: Discography;
  preRelease: PreReleaseResponseWrapper | null;
  relatedContent: RelatedContent;
  sharingInfo: SharingInfo;
  stats: ArtistStats;
  saved: boolean;
}
export interface ConcertItem {
  __typename: 'ConcertV2';
  festival: boolean;
  location: ConcertLocation;
  startDateIsoString: string;
  title: string;
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
  playability: Playability;
  playedState: PlayedState;
  podcastV2: PodcastResponseWrapper;
  releaseDate: ReleaseDate;
  restrictions: EpisodeRestrictions;
  uri: string;
}
export interface NotFound {
  __typename: 'NotFound';
}
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
export interface Podcast {
  __typename: 'Podcast';
  coverArt: PodcastCoverArt;
  mediaType: 'MIXED' | 'AUDIO';
  name: string;
  publisher: PodcastPublisher;
  topics?: PodcastTopics;
  uri: string;
}
export interface PodcastTopic {
  __typename: 'PodcastTopic';
  title: string;
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
export interface User {
  __typename: 'User';
  avatar: UserAvatar | null;
  name: string;
  uri: string;
  username: string;
  id?: string;
  displayName?: string;
}

// Wrapper Interfaces
export interface AlbumResponseWrapper {
  __typename: 'AlbumResponseWrapper';
  data: Album;
}
export interface ArtistResponseWrapper {
  __typename: 'ArtistResponseWrapper';
  data: Artist;
}
export interface EpisodeResponseWrapper {
  __typename: 'EpisodeResponseWrapper';
  data: Episode;
}
export interface PlaylistResponseWrapper {
  __typename: 'PlaylistResponseWrapper';
  data: Playlist;
}
export interface PodcastResponseWrapper {
  __typename: 'PodcastResponseWrapper';
  data: Podcast;
}
export interface PreReleaseResponseWrapper {
  __typename: 'PreReleaseResponseWrapper';
  data: PreRelease;
}
export interface TrackResponseWrapper {
  __typename: 'TrackResponseWrapper';
  data: Track | NotFound;
}
export interface UserResponseWrapper {
  __typename: 'UserResponseWrapper';
  data: User;
}

// Page & Section Interfaces
export interface AlbumOrPrereleasePage {
  __typename: 'AlbumOrPrereleasePage';
  items: (AlbumResponseWrapper | PreReleaseResponseWrapper)[];
  totalCount: number;
}

export interface ArtistStats {
  followers: number;
  monthlyListeners: number;
  worldRank: number;
}
export interface ArtistTopTrack {
  albumOfTrack: AlbumOfTrack;
  artists: {
    items: ArtistSimplified[];
  };
  associationsV3: AssociationsV3;
  contentRating: ContentRating;
  discNumber: number;
  duration: Duration;
  id: string;
  name: string;
  playability: Playability;
  playcount: string;
  uri: string;
}
export interface ChipOrder {
  items: ChipOrderItem[];
}
export interface Discography {
  albums: ReleaseSection;
  compilations: ReleaseSection;
  latest: ReleaseItem;
  popularReleasesAlbums: ReleaseSection;
  singles: ReleaseSection;
  topTracks: TopTracksSection;
}
export interface Gallery {
  items: GalleryImageItem[];
}
export interface GalleryImageItem {
  sources: CoverArtSource[];
}
export interface Goods {
  concerts: PaginatedResponse<ConcertItem>;
}
export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
}
export type RelatedArtistsSection = PaginatedResponse<Artist>;
export interface RelatedContent {
  relatedArtists: RelatedArtistsSection;
}
export interface ReleaseItem {
  copyright: Copyright;
  coverArt: AlbumCoverArt;
  date: FullDate;
  id: string;
  label: string;
  name: string;
  playability: Playability;
  sharingInfo: SharingInfo;
  tracks: TracksSummary;
  type: ReleaseType;
  uri: string;
}
export type ReleaseSection = PaginatedResponse<ReleaseItem>;
export interface SearchResultItemWrapper<T> {
  item: T;
}
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
export interface TopResultsV2 {
  featured: PlaylistResponseWrapper[];
  itemsV2: SearchResultItemWrapper<
    TrackResponseWrapper | ArtistResponseWrapper | PlaylistResponseWrapper
  >[];
}
export interface TopTracksSection {
  items: ArtistTopTrack[];
}

// Response objects
export interface SoytifyArtistOverviewResponse {
  data: {
    artistUnion: Artist;
  };
  extensions: {
    requestIds: {
      [key: string]: {
        [key: string]: string;
      };
    };
  };
}
export interface SoytifySearchV2Response {
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
