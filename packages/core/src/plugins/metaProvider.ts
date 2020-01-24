import Plugin from './plugin';
import { 
  SearchResultsArtist, 
  SearchResultsAlbum, 
  SearchResultsTrack 
} from '../interfaces/data';

abstract class MetaProvider extends Plugin {
  sourceName: string;
  searchName: string;

  abstract searchForArtists(query): Promise<Array<SearchResultsArtist>>;
  abstract searchForReleases(query): Promise<Array<SearchResultsAlbum>>;
  abstract searchForTracks(query): Promise<Array<SearchResultsTrack>>;
  abstract searchAll(query): Promise<Array<SearchResultsArtist | SearchResultsAlbum>>;
}

export default MetaProvider;