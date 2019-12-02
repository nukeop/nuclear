import React from 'react';
import {compose, withHandlers} from 'recompose';
import {AlbumGrid} from '@nuclear/ui';

const AlbumListComponent = props => <AlbumGrid {...props} />;
export default compose(
  withHandlers({
    onAlbumClick: ({albumInfoSearch, history}) => (album) => {
      albumInfoSearch(album.id, album.type);
      history.push('/album/' + album.id);
    }
  })
)(AlbumListComponent);
