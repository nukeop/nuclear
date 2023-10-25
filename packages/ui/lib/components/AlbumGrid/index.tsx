import React, { useState } from 'react';
import cx from 'classnames';
import _ from 'lodash';
import { Dimmer, Loader } from 'semantic-ui-react';

import AlbumPreview from '../AlbumPreview';
import Card from '../Card';
import common from '../../common.scss';
import styles from './styles.scss';
import { getThumbnail, getTrackItem } from '../..';

const AlbumGrid = ({
  albums,
  removeFavoriteAlbum,
  loading,
  trackButtons,
  onAlbumClick,
  addToQueue,
  selectSong,
  startPlayback,
  autoSize,
  withArtistNames,
  withAlbumPreview
}) => {
  const [selectedAlbum, selectAlbum] = useState(albums?.length > 0 ? albums[0] : null);
  const handleAlbumClick = album => _.isNil(onAlbumClick) ? selectAlbum(album) : onAlbumClick(album);

  const onAddToQueue = () => {
    selectedAlbum.tracks.map(track => addToQueue(getTrackItem(track)));
  };

  const onPlayAll = () => {
    onAddToQueue();
    selectSong(0);
    startPlayback(false);
  };

  return (
    <div className={cx(
      common.nuclear,
      styles.album_grid,
      { [styles.loading]: loading },
      { [styles.auto_size]: autoSize && !loading }
    )}>
      <div className={styles.album_cards}>
        {!loading &&
            !_.isEmpty(albums) &&
            albums.map((album, i) => (
              <Card
                key={i}
                header={album.title}
                content={withArtistNames && _.get(album, 'artist.name')}
                image={getThumbnail(album)}
                onClick={() => handleAlbumClick(album)}
                withMenu={removeFavoriteAlbum ? true : false}
                menuEntries={[
                  {
                    type: 'item', props: {
                      children: 'Remove',
                      onClick: () => removeFavoriteAlbum(album)
                    }
                  }
                ]} />
            ))}
      </div>

      {!loading && withAlbumPreview &&
      <>
        <hr />
        <AlbumPreview
          album={selectedAlbum}
          trackButtons={trackButtons}
          handleAddToQueue={onAddToQueue}
          handlePlayAll={onPlayAll} />
      </>}
      {loading && <Dimmer active><Loader /></Dimmer>}
    </div>
  );
};

export default AlbumGrid;
