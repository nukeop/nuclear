import React from 'react';
import { useHistory } from 'react-router';

import { ArtistGrid } from '@nuclear/ui';

type ArtistListComponentProps = {
  artists: { id: string, name: string } [];
  artistInfoSearch: (artistId: any, artist: any) => Promise<void>;
  removeFavoriteArtist: React.MouseEventHandler;
}

export const ArtistListComponent: React.FC<ArtistListComponentProps> = ({
  artists,
  artistInfoSearch,
  removeFavoriteArtist
}) => {
  const history = useHistory();

  const onArtistClick = (artist) => {
    artistInfoSearch(artist.id, artist);
    history.push('/artist/' + artist.id);
  };

  return <ArtistGrid 
    artists={artists} 
    removeFavoriteArtist={removeFavoriteArtist}
    onArtistClick={onArtistClick}
    autoSize/>;
};

export default ArtistListComponent;
