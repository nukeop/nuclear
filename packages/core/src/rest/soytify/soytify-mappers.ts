import { Album, AlbumResponseWrapper, AlbumUnion, Artist, ArtistResponseWrapper, ReleaseItem, SearchResultItemWrapper, Track, TrackResponseWrapper } from './Soytify.types';
import { getImageSet, getThumbnailSizedImage } from '../../util';
import { AlbumDetails, SearchResultsAlbum, SearchResultsArtist, SearchResultsSource, SearchResultsTrack } from '../../plugins/plugins.types';
import NuclearTrack from '../../structs/Track';

export const mapSoytifyArtistSearchResult = (artistSearchResult: ArtistResponseWrapper): SearchResultsArtist => {
  const data = artistSearchResult.data;
  const imageSet = getImageSet(data.visuals.avatarImage?.sources);
        
  return {
    id: data.uri,
    name: data.profile.name,
    source: SearchResultsSource.Soytify,
    ...imageSet
  };
};

export const mapSoytifyReleaseItem = (releaseItem: ReleaseItem, artist: Artist): SearchResultsAlbum => {
  const imageSet = getImageSet(releaseItem.coverArt?.sources);
  const mapped = {
    id: releaseItem.uri,
    ...imageSet,
    images: releaseItem.coverArt?.sources.map((source) => source.url) ?? [],
    title: releaseItem.name,
    artist: artist.profile.name,
    resourceUrl: releaseItem.uri,
    type: releaseItem.type,
    year: releaseItem.date.year.toString(),
    source: SearchResultsSource.Soytify
  };

  return mapped;
};

export const mapSoytifyReleaseSearchResult = (releaseSearchResult: AlbumResponseWrapper): SearchResultsAlbum => {
  const data = releaseSearchResult.data as Album;
  const imageSet = getImageSet(data.coverArt?.sources);
  return {
    id: data.uri,
    ...imageSet,
    images: data.coverArt?.sources.map((source) => source.url) ?? [],
    title: data.name,
    artist: data.artists?.items[0].profile.name ?? 'Unknown',
    resourceUrl: data.uri,
    type: data.type,
    source: SearchResultsSource.Soytify
  };
};

export const mapSoytifyTrackSearchResult = (trackSearchResult: SearchResultItemWrapper<TrackResponseWrapper>): SearchResultsTrack => {
  const data = trackSearchResult.item.data as Track;

  const thumb = getThumbnailSizedImage(data.albumOfTrack.coverArt?.sources);
  return {
    id: data.uri,
    title: data.name,
    artist: data.artists.items[0].profile.name,
    thumb,
    source: SearchResultsSource.Soytify
  };
};

export const mapSoytifyAlbumDetails = (album: AlbumUnion): AlbumDetails => {
  const imageSet = getImageSet(album.coverArt?.sources);
  return {
    id: album.uri,
    artist: album.artists.items[0].profile.name,
    title: album.name,
    ...imageSet,
    year: album.date.year?.toString(),
    type: album.type,
    resourceUrl: album.uri,
    tracklist: album.tracksV2.items.map(trackObj => mapSoytifyAlbumTrack(trackObj.track))
  };
};

export const mapSoytifyAlbumTrack = (track: Track): NuclearTrack => new NuclearTrack({
  ids: { [SearchResultsSource.Soytify]: track.uri },
  artist: track.artists.items[0].profile.name,
  title: track.name,
  duration: Math.round(track.duration.totalMilliseconds / 1000),
  position: track.trackNumber,
  discNumber: track.discNumber,
  playcount: track.playcount
});
