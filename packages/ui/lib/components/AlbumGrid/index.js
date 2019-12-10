import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import _ from 'lodash';
import { Dimmer, Loader } from 'semantic-ui-react';
import { compose, withState, withHandlers } from 'recompose';

import { getThumbnail } from '../../utils';
import AlbumPreview from '../AlbumPreview';
import Card from '../Card';
import common from '../../common.scss';
import styles from './styles.scss';


const AlbumGrid = ({
  albums,
  onAlbumClick,
  selectedAlbum,
  loading,
  trackButtons,
  onAddToQueue,
  onPlayAll,
  autoSize,
  withArtistNames,
  withAlbumPreview
}) => (
  <div className={cx(
    common.nuclear,
    styles.album_grid,
    { [styles.loading]: loading },
    { [styles.auto_size]: autoSize }
  )} >
    <div className={styles.album_cards}>
      {
        !loading &&
        !_.isEmpty(albums) &&
        albums.map((album, i) => (
          <Card
            key={i}
            header={album.title}
            content={withArtistNames && _.get(album, 'artist.name')}
            image={getThumbnail(album)}
            onClick={() => onAlbumClick(album)}
          />
        ))
      }
    </div>

    {
      !loading && withAlbumPreview &&
      <>
        <hr />
        <AlbumPreview
          album={selectedAlbum}
          trackButtons={trackButtons}
          handleAddToQueue={onAddToQueue}
          handlePlayAll={onPlayAll}
        />
      </>
    }
    {loading && <Dimmer active><Loader /></Dimmer>}
  </div>
);

AlbumGrid.propTypes = {
  albums: PropTypes.array,
  // streamProviders: PropTypes.array,
  onAlbumClick: PropTypes.func,
  loading: PropTypes.bool,
  // addToQueue: PropTypes.func,
  // clearQueue: PropTypes.func,
  // selectSong: PropTypes.func,
  // startPlayback: PropTypes.func,
  onAddToQueue: PropTypes.func,
  onPlayAll: PropTypes.func,

  autoSize: PropTypes.bool,
  withArtistNames: PropTypes.bool,
  withAlbumPreview: PropTypes.bool,

  trackButtons: PropTypes.object
};

export default compose(
  withState(
    'selectedAlbum',
    'selectAlbum',
    ({ albums }) => _.head(albums)
  ),
  withHandlers({
    onAlbumClick: ({ onAlbumClick, selectAlbum }) => album => _.isNil(onAlbumClick) ? selectAlbum(album) : onAlbumClick(album),
    onAddToQueue: ({ addToQueue, selectedAlbum, streamProviders }) => () => {
      selectedAlbum.tracks.map(track => addToQueue(
        streamProviders, {
          artist: _.get(track, 'artist.name'),
          name: _.get(track, 'name'),
          thumbnail: getThumbnail(track)
        }
      ));
    }
  }),
  withHandlers({
    onPlayAll: ({ selectSong, startPlayback, onAddToQueue }) => () => {
      onAddToQueue();
      selectSong(0);
      startPlayback();
    }
  })
)(AlbumGrid);
