import React from 'react';
import {compose, withHandlers} from 'recompose';
import {AlbumGrid} from '@nuclear/ui';

const AlbumListComponent = props => <AlbumGrid {...props} autoSize/>;
export default compose(
  withHandlers({
    onAlbumClick: ({albumInfoSearch, history}) => (album) => {
      // console.log(album.id + ' ' + album.type + ' ' + album);
      albumInfoSearch(album.id, album.type, album);
      history.push('/album/' + album.id);
    }
  })
)(AlbumListComponent);
