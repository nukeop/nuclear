import { NuclearService } from './NuclearService';
import { GetPlaylistsByUserIdResponseBody, PostPlaylistRequestBody, PostPlaylistResponseBody } from './Playlists.types';
import { ErrorBody } from './types';

export class NuclearPlaylistsService extends NuclearService {
  getPlaylistsByUserId(token: string, id: string) {
    return this.getJson<GetPlaylistsByUserIdResponseBody, ErrorBody>(
      fetch(`${this.baseUrl}/users/${id}/playlists`, {
        headers: {
          ...this.getHeaders(),
          Authorization: `Bearer ${token}`
        }
      })
    );
  }

  postPlaylist(token: string, body: PostPlaylistRequestBody) {
    return this.getJson<PostPlaylistResponseBody, ErrorBody>(
      fetch(`${this.baseUrl}/playlists`, {
        method: 'POST',
        headers: {
          ...this.getHeaders(),
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(this.prepareBody(body))
      })
    );
  }
}
