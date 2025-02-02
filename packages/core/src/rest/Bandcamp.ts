/* eslint-disable @typescript-eslint/no-explicit-any */
import * as cheerio from 'cheerio';
import * as bandcamp from 'bandcamp-scraper';
import _ from 'lodash';

type BandcampAlbumInfo = {
  artist: string;
  title: string;
  imageUrl: string;
  url: string;
  tracks: Array<BandcampTrack>;
}

type BandcampArtistInfo = {
  name: string;
  location: string;
  coverImage: string;
  description: string;
  albums: {
    url: string;
    coverImage?: string;
    title: string;
  }[];
  shows: {
    date: string;
    venue: string;
    venueUrl: string;
    location: string;
  }[];
  bandLinks: {
    name: string;
    url: string;
  }[];
}

type BandcampTrack = {
  name: string;
  url: string;
  duration: string;
}

export type BandcampSearchResult = {
  type: 'artist' | 'album' | 'track';
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
  }]);
});

export const search = (query: string, page = 1): Promise<BandcampSearchResult[]> => promisify(bandcamp.search, { query, page });
export const getAlbumInfo = (albumUrl: string): Promise<BandcampAlbumInfo> => promisify(bandcamp.getAlbumInfo, albumUrl);
export const getArtistInfo = (artistUrl: string): Promise<BandcampArtistInfo> => promisify(bandcamp.getArtistInfo, artistUrl);

export const getTrackData = async (trackUrl: string) => {
  const page = await fetch(trackUrl);
  const html = await page.text();

  const $ = cheerio.load(html);
  const scriptWithRaw = $('script[data-tralbum]');

  let meta;
  if (scriptWithRaw.length > 0) {
    meta = scriptWithRaw.data('tralbum');
  }

  const imageUrl = $('#tralbumArt').first().find('a').first().attr('href');
  const duration = _.get(meta, 'trackinfo[0].duration', 0);
  const stream = _.get(meta, 'trackinfo[0].file[\'mp3-128\']');
  const name = _.get(meta, 'trackinfo[0].title');

  return {
    url: trackUrl,
    imageUrl,
    name,
    stream,
    duration,
    tags: [],
    type: 'track' as const
  };
};
