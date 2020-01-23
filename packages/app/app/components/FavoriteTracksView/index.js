import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Icon, Segment, Table } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';

import Header from '../Header';
import TrackRow from '../TrackRow';

import trackRowStyles from '../TrackRow/styles.scss';
import styles from './styles.scss';

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
  removeFavoriteTrack
}) => {
  const { t } = useTranslation('favorites');

  const renderPlayAllButton = () => {
    return (
      <a href='#' className={styles.play_button}>
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
  removeFavoriteTrack: PropTypes.func
};

FavoriteTracksView.defaultProps = {
  tracks: [],
  removeFavoriteTrack: () => {}
};

export default FavoriteTracksView;
