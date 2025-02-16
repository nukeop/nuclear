import React, { useState } from 'react';
import cx from 'classnames';
import _ from 'lodash';
import { Dimmer, Loader } from 'semantic-ui-react';

import AlbumPreview from '../AlbumPreview';
import Card from '../Card';
import common from '../../common.scss';
import styles from './styles.scss';
import { getThumbnail, getTrackItem } from '../..';
import { SearchResultsAlbum } from '@nuclear/core/src/plugins/plugins.types';
import { Track } from '@nuclear/core';

type AlbumGridProps = {
  albums?: SearchResultsAlbum[];
  removeFavoriteAlbum?: (album: SearchResultsAlbum) => void;
  loading?: boolean;
  trackButtons?: React.ElementType;
  onAlbumClick?: (album: SearchResultsAlbum) => void;
  addToQueue?: (track: Track) => void;
  selectSong?: (index: number) => void;
  startPlayback?: (play: boolean) => void;
  autoSize?: boolean;
  withArtistNames?: boolean;
  withAlbumPreview?: boolean;
};

const AlbumGrid: React.FC<AlbumGridProps> = ({
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
    selectedAlbum.tracklist.map(track => addToQueue(getTrackItem(track) as Track));
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
                data-testid='album-card'
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
