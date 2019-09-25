import React from 'react';
import { Tab } from 'semantic-ui-react';
import FontAwesome from 'react-fontawesome';
import cx from 'classnames';

import TrackRow from '../../TrackRow';

import trackRowStyles from '../../TrackRow/styles.scss';
import styles from './styles.scss';
import { useTranslation } from 'react-i18next';

const ChartsTab = ({ topTracks }) => {
  const { t } = useTranslation('dashboard');

  return (
    <Tab.Pane attached={false}>
      <div
        className={cx(
          styles.popular_tracks_container,
          trackRowStyles.tracks_container
        )}
      >
        <h3>{t('lastfm-title')}</h3>
        <table>
          <thead>
            <tr>
              <th>
                <FontAwesome name='image' />
              </th>
              <th>{t('artist')}</th>
              <th>{t('title')}</th>
              <th>{t('playcounts')}</th>
            </tr>
            <tr />
          </thead>
          <tbody>
            {topTracks.map((track, index) => {
              return (
                <TrackRow
                  key={'popular-track-row-' + index}
                  track={track}
                  index={'popular-track-' + index}
                  displayCover
                  displayArtist
                  displayPlayCount
                  withFavorites
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
