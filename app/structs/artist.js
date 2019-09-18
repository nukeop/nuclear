import get from 'lodash/get';
import map from 'lodash/map';
import uuidv4 from 'uuid/v4';

export default class Artist {
  constructor(data) {
    this.uuid = uuidv4();
    this.ids = get(data, 'ids') || [];
    this.name = get(data, 'name');
    this.description = get(data, 'description');
    this.tags = get(data, 'tags');
    this.onTour = get(data, 'onTour');

    this.coverImage = get(data, 'coverImage');
    this.thumbnail = get(data, 'thumbnail');
    this.images = get(data, 'images');

    this.albums = get(data, 'albums');
    this.topTracks = get(data, 'topTracks');
    this.similarArtists = get(data, 'similarArtists');
  }

  addDiscogsSearchData(data) {
    this.ids = { ...this.ids, discogs: data.id };
    this.name = data.title;
    this.coverImage = data.cover_image;
    this.thumbnail = data.thumb;
  }

  addDiscogsData(data) {
    this.ids = { ...this.ids, discogs: data.id };
    this.name = data.name;
    this.description = data.profile;
    this.images = data.images;
  }

  addLastfmData(data) {
    this.ids = { ...this.ids, musicbrainz: data.mbid };
    this.name = data.name;
    this.description = get(data, 'bio.content');
    this.tags = map(get(data, 'tags.tag'), 'name');
    this.onTour = data.ontour === 1;
    this.similarArtists = map(get(data, 'similar.artist'), 'name');
  }

  static fromDiscogsSearchData(data) {
    let artist = new Artist();
    artist.addDiscogsSearchData(data);
    return artist;
  }

  static fromDiscogsData(data) {
    let artist = new Artist();
    artist.addDiscogsData(data);
    return artist;
  }

  static fromLastfmData(data) {
    let artist = new Artist();
    artist.addLastfmData(data);
    return artist;
  }
}
