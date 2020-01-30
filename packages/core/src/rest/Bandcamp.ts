/*
eslint-disable
*/
import bandcamp from 'bandcamp-scraper';

type BandcampAlbumInfo = {
  artist: string;
  title: string;
  imageUrl: string;
  url: string;
  tracks: Array<BandcampTrack>;
}

type BandcampTrack = {
  name: string;
  url: string;
  duration: string;
}

type BandcampSearchResult = {
  type: 'artist' | 'album';
  name: string;
  url: string;
  imageUrl: string;
  tags: string[];

  genre?: string;
  location?: string;
  releaseDate?: string;
  artist?: string;
}

const promisify = <T>(func: Function, arg: any): Promise<T> => new Promise((resolve, reject) => {
  func.apply(null, [arg, (err, result) => {
    if (err) {
      reject(err);
    } else {
      resolve(result);
    }
  }])
})

export const search = (query: string): Promise<BandcampSearchResult[]> => promisify(bandcamp.search, { query, page: 1 })
export const getAlbumsForArtist = (artistUrl: string): Promise<string[]> => promisify(bandcamp.getAlbumUrls, artistUrl)
export const getAlbumInfo = (albumUrl: string): Promise<BandcampAlbumInfo> => promisify(bandcamp.getAlbumInfo, albumUrl)


//TODO: extract the stream url
export const getTrackStream = async (trackUrl: string) => {
  const html = await fetch(trackUrl)
  return await html.text()
}