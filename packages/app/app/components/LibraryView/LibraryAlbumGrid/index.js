import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {compose, withProps} from 'recompose';
import {AlbumGrid} from '@nuclear/ui';

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
        thumb: _(group)
          .map('image[0][\'#text\']')
          .uniq()
          .filter(el => !_.isNil(el))
          .value(),
        tracks: group
      }))
      .value()
  }))
)(LibraryAlbumGrid);
