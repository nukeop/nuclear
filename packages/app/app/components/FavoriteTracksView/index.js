import React, {useState} from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import _ from 'lodash';
import { Icon, Segment, Table } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';

import Header from '../Header';
import DisplayFavouriteTracks, {SORT_TYPE} from './DisplayFavouriteTracks';

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
                  <Table.HeaderCell onClick={() => updateSortOrder(SORT_TYPE.ARTIST)} >
                    <div className={styles.theader_icon}> 
                      {t('artist')}
                      {
                        sortOrder.current === SORT_TYPE.ARTIST &&
                        (sortOrder.isAscending  ? <Icon name='caret up' /> : <Icon name='caret down' />)
                      }
                    </div>
                  </Table.HeaderCell>
                  <Table.HeaderCell onClick={() => updateSortOrder(SORT_TYPE.TITLE)} >
                    <div className={styles.theader_icon}>
                      {t('title')}
                      {
                        sortOrder.current === SORT_TYPE.TITLE &&
                        (sortOrder.isAscending ? <Icon name='caret up' /> : <Icon name='caret down' />)
                      }
                    </div>
                  </Table.HeaderCell>
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

