import React, {useState} from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import _ from 'lodash';
import { Icon, Segment, Table } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import { TrackRow } from '@nuclear/ui';

import Header from '../Header';

import trackRowStyles from '../TrackRow/styles.scss';
import styles from './styles.scss';
import artPlaceholder from '../../../resources/media/art_placeholder.png';

export const EmptyState = () => {
  const { t } = useTranslation('favorites');

  return (
    <div className={styles.empty_state} >
      <Icon name='star'/>
      <h2>{t('empty')}</h2>
      <div>{t('empty-help')}</div>
    </div>
  );
};

const SORT_TYPE = {
  NONE: 'none',
  ARTIST: 'artist',
  TITLE: 'title'
};

const DisplayFavouriteTracks = ({
  tracks,
  removeFavoriteTrack,
  sortOrder
}) => {

  const sortArtist = (list, asc = true) => {
    const output = list.sort((a, b) => {
      if (a.artist.name.toLowerCase() < b.artist.name.toLowerCase()) {
        return -1;
      }
      if (a.artist.name.toLowerCase() > b.artist.name.toLowerCase()) {
        return 1;
      }
      return 0;
    });

    return asc ? output : output.reverse();
  };

  const sortTitle = (list, asc = true) => {
    const output = list.sort((a, b) => {
      if (a.name.toLowerCase() < b.name.toLowerCase()) {
        return -1;
      }
      if (a.name.toLowerCase() > b.name.toLowerCase()) {
        return 1;
      }
      return 0;
    });

    return asc ? output : output.reverse();
  };


  switch (sortOrder.current) {
  case SORT_TYPE.ARTIST:
    tracks = sortArtist(tracks, sortOrder.isAscending);
    break;
  case SORT_TYPE.TITLE:
    tracks = sortTitle(tracks, sortOrder.isAscending);
    break;
  default:
    break;
  }

  return (
    tracks.map((track, i) => {
      return (
        <TrackRow
          key={'favorite-track-' + i}
          track={track}
          index={i}
          displayCover
          displayArtist
          withDeleteButton
          withAddToFavorites={false}
          onDelete={e => {
            e.stopPropagation();
            removeFavoriteTrack(track);
          }}
        />
      );
    })
  );


};

DisplayFavouriteTracks.propTypes = {
  tracks: PropTypes.arrayOf(PropTypes.shape({
    artist: PropTypes.shape({
      name: PropTypes.string
    }),
    name: PropTypes.string
  })),
  removeFavoriteTrack: PropTypes.func,
  sortOrder: PropTypes.shape({
    current: PropTypes.string,
    isAscending: PropTypes.bool
  })
};

DisplayFavouriteTracks.defaultProps = {
  tracks: [],
  removeFavoriteTrack: () => {},
  sortOrder: SORT_TYPE.NONE
};

const FavoriteTracksView = ({
  tracks,
  removeFavoriteTrack,
  clearQueue,
  selectSong,
  startPlayback,
  addToQueue,
  streamProviders
}) => {
  const { t } = useTranslation('favorites');

  const [sortOrder, setSortOrder] = useState({current: SORT_TYPE.NONE, isAscending: true});

  const getTrackimage = (track) => {
    let image = artPlaceholder;
    if (track.image && track.image.length > 0) {
      image = track.image[0]['#text'];
    }
    return image;
  };

  const addTracksToQueue = () => {

    tracks.map(track => {
      const trackImage = getTrackimage(track);
      addToQueue(streamProviders, {
        artist: track.artist.name,
        name: track.name,
        thumbnail: trackImage
      });
    });
  };

  const playAll = (tracks) => {
    clearQueue();
    addTracksToQueue(tracks);
    selectSong(0);
    startPlayback();
  };


  const renderPlayAllButton = () => {
    return (
      <a href='#' className={styles.play_button} onClick={playAll}>
        <Icon name='play'/> Play
      </a>
    );
  };

  const updateSortOrder = (currentOrder) => {
    setSortOrder({
      current: currentOrder,
      isAscending: !sortOrder.isAscending
    });
  };

  
  return (
    <div className={styles.favorite_tracks_view}>
      {
        _.isEmpty(tracks) &&
          <EmptyState />
      }
      {
        !_.isEmpty(tracks) &&
        <React.Fragment>
          <Header>
            {t('header')}
          </Header>
          <div className={styles.button_container}>
            {renderPlayAllButton()}
          </div>
          <Segment className={trackRowStyles.tracks_container}>
            <Table
              className={cx(
                styles.favorite_tracks_table,
                styles.table
              )}
            >
              <Table.Header className={styles.thead}>
                <Table.Row>
                  <Table.HeaderCell />
                  <Table.HeaderCell><Icon name='image' /></Table.HeaderCell>
                  <Table.HeaderCell onClick={() => updateSortOrder(SORT_TYPE.ARTIST)} >{t('artist')}</Table.HeaderCell>
                  <Table.HeaderCell onClick={() => updateSortOrder(SORT_TYPE.TITLE)} >{t('title')}</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body className={styles.tbody}>
                <DisplayFavouriteTracks tracks={tracks} removeFavoriteTrack={removeFavoriteTrack} sortOrder={sortOrder} />
              </Table.Body>
            </Table>
          </Segment>
        </React.Fragment>
      }
    </div>
  );
};

FavoriteTracksView.propTypes = {
  tracks: PropTypes.arrayOf(PropTypes.shape({
    artist: PropTypes.shape({
      name: PropTypes.string
    }),
    name: PropTypes.string
  })),
  removeFavoriteTrack: PropTypes.func,
  streamProviders: PropTypes.array
};

FavoriteTracksView.defaultProps = {
  tracks: [],
  streamProviders: [],
  removeFavoriteTrack: () => {}
};

export default FavoriteTracksView;

