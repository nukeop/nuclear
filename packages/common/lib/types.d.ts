export declare enum PlaybackStatus {
    PAUSED = "PAUSED",
    PLAYING = "PLAYING",
    STOPPED = "STOPPED"
}
export interface NuclearStatus {
    playbackStatus: PlaybackStatus;
    volume: number;
    shuffleQueue: boolean;
    loopAfterQueueEnd: boolean;
}
export interface NuclearMeta {
    uuid: string;
    thumbnail: string;
    streams: Array<{
        duration: number;
    }>;
    name: string;
    artist: string;
}
export interface NuclearBrutMeta {
    uuid: string;
    duration?: number;
    path: string;
    name?: string;
    pos: number;
    album?: string;
    artist: {
        name: string;
    };
    genre?: string[];
    year?: string | number;
    loading: boolean;
    local?: boolean;
    image: Array<{
        '#text': string;
    } | undefined>;
}
export interface NuclearPlaylist {
    name: string;
    tracks: NuclearMeta[];
}
