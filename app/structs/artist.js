import get from 'lodash/get';
import uuidv4 from 'uuid/v4';

export default class Artist {
  constructor(data) {
    this.uuid = uuidv4();
    this.ids = get(data, 'ids');
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

  static fromDiscogsSearchData(data) {
    return new Artist({
      ids: { discogs: data.id },
      name: data.title,
      coverImage: data.cover_image,
      thumbnail: data.thumb
    });
  }

  static fromDiscogsData(data) {
    return new Artist({
      ids: { discogs: data.id },
      name: data.name,
      description: data.profile,
      images: data.images
    });
  }

  static fromLastfmData(data) {
    return new Artist({
      ids: { musicbrainz: data.mbid },
      name: data.name,
      description: _.get(data, 'bio.content'),
      tags: _.map(_.get(data, 'tags.tag'), 'name'),
      onTour: data.ontour === 1,
      similarArtists: _.map(_.get(data, 'similar.artist'), 'name')
    });
  }
}
