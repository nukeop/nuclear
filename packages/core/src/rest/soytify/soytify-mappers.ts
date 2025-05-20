import { Album, AlbumResponseWrapper, ArtistResponseWrapper, SearchResultItemWrapper, Track, TrackResponseWrapper } from './soytify.types';
import { getImageSet, getThumbnailSizedImage } from '../../util';
import { SearchResultsAlbum, SearchResultsArtist, SearchResultsSource, SearchResultsTrack } from '../../plugins/plugins.types';

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

export const mapSoytifyReleaseSearchResult = (releaseSearchResult: AlbumResponseWrapper): SearchResultsAlbum => {
  const data = releaseSearchResult.data as Album;
  const imageSet = getImageSet(data.coverArt?.sources);
  const { thumb, coverImage } = imageSet;
  return {
    id: data.uri,
    coverImage,
    thumb,
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
