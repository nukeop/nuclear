import React from 'react';
import _ from 'lodash';
import { compose, withHandlers, lifecycle } from 'recompose';

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
