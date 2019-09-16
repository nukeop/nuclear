export default class Artist {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.tags = data.tags;
    this.onTour = data.onTour;

    this.coverImage = data.coverImage;
    this.thumbnail = data.thumbnail;
    this.images = data.images;

    this.albums = data.albums;
    this.topTracks = data.topTracks;
    this.similarArtists = data.similarArtists;
  }

  static fromDiscogsSearchData(data) {
    return new Artist({
      id: data.id,
      name: data.title,
      coverImage: data.cover_image,
      thumbnail: data.thumb
    });
  }

  static fromDiscogsData(data) {
    return new Artist({
      id: data.id,
      name: data.name,
      description: data.profile,
      images: data.images
    });
  }

  static fromLastfmData(data) {
    return new Artist({
      name: data.name,
      description: _.get(data, 'bio.content'),
      tags: _.map(_.get(data, 'tags.tag'), 'name'),
      onTour: data.ontour === 1,
      similarArtists: _.map(_.get(data, 'similar.artist'), 'name')
    });
  }
}
