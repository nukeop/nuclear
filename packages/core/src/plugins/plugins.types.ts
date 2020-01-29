export type SearchResultsArtist = {
    id: number | string;
    coverImage: string;
    thumb: string;
    title: string;
    resourceUrl?: string;
}

export type SearchResultsAlbum = {
    id: number | string;
    coverImage: string;
    thumb: string;
    title: string;
    resourceUrl?: string;
}

export type SearchResultsTrack = {
    id: number | string;
}

export type StreamQuery = {
    artist: string;
    track: string;
}

export type StreamData = {
    source: string;
    id: string;
    stream: string;
    duration: number;
    title: string;
    thumbnail: string;
}
