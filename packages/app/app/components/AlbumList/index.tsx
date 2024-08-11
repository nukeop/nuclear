import React from 'react';
import {AlbumGrid} from '@nuclear/ui';

const AlbumListComponent = props => {
  const onAlbumClick = (album) => {
    props.albumInfoSearch(album.id, album.type, album);
    props.history.push('/album/' + album.id);
  };

  return <AlbumGrid {...props} onAlbumClick={onAlbumClick} autoSize />;
};
export default AlbumListComponent;
