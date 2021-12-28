export type ApiTrack = {
  id: string;
  name: string;
  artistId: string;
  addedBy: string;
};

export type ApiPlaylist = {
  id: string;
  author: string;
  name: string;
  tracks: ApiTrack[];
  private: boolean;
};

export type GetPlaylistsByUserIdResponseBody = ApiPlaylist[];

export type PostPlaylistRequestBody = {
  name: string;
  tracks: {
    name: string;
    artist: string;
  }[];
  private: boolean;
};

export type PostPlaylistResponseBody = ApiPlaylist & {
  tracks: ApiTrack[];
  createdAt: string;
  updatedAt: string;
};

export type PutPlaylistRequestBody = PostPlaylistRequestBody;
