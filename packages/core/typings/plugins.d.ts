type SearchResultsArtist = {
    id: number | string;
    coverImage: string;
    thumb: string;
    title: string;
    resourceUrl?: string;
}

type SearchResultsAlbum = {
    id: number | string;
    coverImage: string;
    thumb: string;
    title: string;
    resourceUrl?: string;
}

type SearchResultsTrack = {
    id: number | string;
}

type StreamQuery = {
    artist: string;
     track: string;
  }

  type StreamData = {
      source: string;
      id: string;
      stream: string;
      duration: number;
      title: string;
      thumbnail: string;
  }