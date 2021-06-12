import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import _ from 'lodash';
import { Icon, Segment, Table } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import { TrackRow, getTrackItem } from '@nuclear/ui';
import TrackPopupContainer from '../../containers/TrackPopupContainer';
import Header from '../Header';

import trackRowStyles from '../TrackRow/styles.scss';
import styles from './styles.scss';

export const EmptyState = () => {
  const { t } = useTranslation('favorites');

  return (
    <div className={styles.empty_state} >
      <Icon.Group>
        <Icon name='star' />
        <Icon corner name='music' />
      </Icon.Group>
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
  addToQueue
}) => {
  const { t } = useTranslation('favorites');

  const addTracksToQueue = () => {
    tracks.map(track => {
      addToQueue(getTrackItem(track));
    });
  };

  const playAll = () => {
    clearQueue();
    addTracksToQueue();
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
                  <Table.HeaderCell>{t('artist')}</Table.HeaderCell>
                  <Table.HeaderCell>{t('title')}</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body className={styles.tbody}>
                {
                  tracks.map((track, index) => 
                    <TrackPopupContainer
                      key={'popular-track-row-' + index}
                      trigger={
                        <TrackRow
                          key={'favorite-track-' + index}
                          index={index}
                          track={track}
                          displayCover
                          displayArtist
                          withDeleteButton
                          onDelete={e => {
                            e.stopPropagation();
                            removeFavoriteTrack(track);
                          }}
                        />
                      }
                      track={track}
                      artist={track.artist.name}
                      title={track.name}
                      thumb={track.thumbnail}
                      withAddToFavorites={false}
                    />
                  )
                }
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

