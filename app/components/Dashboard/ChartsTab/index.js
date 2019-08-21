import React from 'react';
import { Tab } from 'semantic-ui-react';
import FontAwesome from 'react-fontawesome';
import {useSelector} from 'react-redux';
import cx from 'classnames';

import TrackRow from '../../TrackRow';

import trackRowStyles from '../../TrackRow/styles.scss';
import styles from './styles.scss';
import { useTranslation } from 'react-i18next';
import { useRequest } from 'redux-query-react';

import {mapLastFMTrackToInternal} from '../../../actions/index';

const useTopTracks = () => {
  const topTracks = useSelector(state => state.entities.topTracks || []);
  const [state] = useRequest({
    url: 'http://ws.audioscrobbler.com/2.0/?method=chart.getTopTracks&format=json&api_key=2b75dcb291e2b0c9a2c994aca522ac14', 
    transform: response => ({topTracks: response.tracks.track.map(mapLastFMTrackToInternal)}),
    force: true,
    update: {
      topTracks: (prev, next) => next
    }
  });
  return [topTracks, state];
};

const ChartsTab = () => {
  const { t } = useTranslation('dashboard');
  const [topTracks, state] = useTopTracks;
  
  return (
    <Tab.Pane attached={false} loading={state.isPending}>
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
