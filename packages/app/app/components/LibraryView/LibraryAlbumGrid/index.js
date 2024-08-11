import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {compose, withProps} from 'recompose';
import {AlbumGrid} from '@nuclear/ui';

import TrackPopupButtons from '../../../containers/TrackPopupButtons';

const LibraryAlbumGrid = props => <AlbumGrid {...props} />;

LibraryAlbumGrid.propTypes = {
  tracks: PropTypes.array
};

export default compose(
  withProps(({tracks}) => ({
    albums: _(tracks)
      .groupBy('album')
      .map((group, key) => ({
        title: key,
        artist: _(group)
          .map('artist')
          .thru(_.head)
          .value(),
        thumb: _(group)
          .map('thumbnail')
          .uniq()
          .filter(el => !_.isNil(el))
          .thru(result => _.isEmpty(result) ? null : result)
          .value(),
        tracklist: group
      }))
      .value(),
    trackButtons: TrackPopupButtons
  }))
)(LibraryAlbumGrid);
