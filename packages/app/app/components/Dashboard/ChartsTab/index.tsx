import React, { useCallback } from 'react';
import { Tab } from 'semantic-ui-react';
import FontAwesome from 'react-fontawesome';
import cx from 'classnames';

import TrackRow from '../../TrackRow';
import { AddAllButton } from '../../ArtistView/PopularTracks';

import trackRowStyles from '../../TrackRow/styles.scss';
import styles from './styles.scss';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

type ChartsTabProps = {
  topTracks: any[];
  addToQueue: (item) => void;
}

const ChartsTab: React.FC<ChartsTabProps> = ({
  topTracks,
  addToQueue
}) => {
  const { t } = useTranslation('dashboard');
  const dispatch = useDispatch();
  const addAllToQueue = useCallback(() => topTracks.forEach(track =>
    dispatch(addToQueue({
      artist: (track.artist as any).name,
      name: track.title ?? track.name,
      thumbnail: track.thumbnail
    }))
  ), [addToQueue, dispatch, topTracks]);

  return (
    <Tab.Pane attached={false}>
      <div
        className={cx(
          styles.popular_tracks_container,
          trackRowStyles.tracks_container
        )}
      >
        <div className='popular_tracks_header'>
          <h3>{t('popular-track-title')}</h3>
          <AddAllButton
            t={t}
            handleAddAll={addAllToQueue}
          />
        </div>
        <table>
          <thead>
            <tr>
              <th>
                <FontAwesome name='image' />
              </th>
              <th>{t('artist')}</th>
              <th>{t('title')}</th>
            </tr>
            <tr />
          </thead>
          <tbody>
            {topTracks.map((track, index) => {
              return (
                <TrackRow
                  key={'popular-track-row-' + index}
                  track={track}
                  displayCover
                  displayArtist
                  withAddToFavorites
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </Tab.Pane>
  );
};

export default ChartsTab;
