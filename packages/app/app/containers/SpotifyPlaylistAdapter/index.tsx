import { SpotifyClientProvider, SpotifyPlaylist, mapSpotifyTrack } from '@nuclear/core/src/rest/Spotify';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import PlaylistViewContainer from '../PlaylistViewContainer';
import React from 'react';
import { Dimmer, Loader } from 'semantic-ui-react';

export const SpotifyPlaylistAdapter: React.FC = () => {
  const { playlistId } = useParams<{ playlistId: string }>();

  const [playlist, setPlaylist] = useState<SpotifyPlaylist | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    SpotifyClientProvider.get()
      .then((spotifyClient) => {
        return spotifyClient.getPlaylist(playlistId);
      })
      .then((spotifyPlaylist) => {
        setPlaylist(spotifyPlaylist);  
        setIsLoading(false);
        setIsReady(true);
        setError(null);
      })
      .catch((err: Error) => {
        setError(err.message);
        setIsLoading(false);
        setIsReady(true);
      });
  }, []);

  return !isLoading && isReady && !error ? 
    <PlaylistViewContainer 
      playlist={{
        id: playlist.id,
        name: playlist.name,
        tracks: playlist.tracks.map(mapSpotifyTrack)
      }}
      isExternal
      externalSourceName='Spotify'
    /> 
    : <Dimmer active><Loader /></Dimmer>;
};
