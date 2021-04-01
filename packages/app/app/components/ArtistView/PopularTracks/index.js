import React from 'react';
import FontAwesome from 'react-fontawesome';
import cx from 'classnames';
import { Button } from 'semantic-ui-react';
import { withTranslation } from 'react-i18next';
import { compose, withHandlers, withState } from 'recompose';
import { TrackRow } from '@nuclear/ui';

import TrackPopupContainer from '../../../containers/TrackPopupContainer';
import artPlaceholder from '../../../../resources/media/art_placeholder.png';

import trackRowStyles from '../../TrackRow/styles.scss';
import styles from './styles.scss';

const AddAllButton = ({ 
  handleAddAll,
  t
}) => (
  <Button
    primary
    href='#'
    onClick={handleAddAll}
    className={styles.add_button}
    aria-label={t('queue')}
  >
    <FontAwesome name='plus' /> Add all
  </Button>
);

const PopularTracks = ({
  tracks,
  expanded,
  toggleExpand,
  handleAddAll,
  t
}) => (
  !_.isEmpty(tracks) &&
    <div className={cx(
      styles.popular_tracks_container,
      trackRowStyles.tracks_container
    )}>
      <div className={styles.header}>Popular tracks </div>
      <AddAllButton 
        handleAddAll={handleAddAll}
        t={t}
      />
      <table className={styles.popular_tracks_table}>
        <thead>
          <tr>
            <th>
              <FontAwesome name='photo' />
            </th>
            <th>{t('title')}</th>
            <th>{t('count')}</th>
          </tr>
        </thead>
        <tbody>
          {
            tracks
              .slice(0, expanded ? 15 : 5)
              .map((track, index) => (
                <TrackPopupContainer
                  key={'popular-track-row-' + index}
                  trigger={
                    <TrackRow
                      index={'popular-track-' + index}
                      track={track}
                      displayCover
                      displayPlayCount
                    />
                  }
                  title={track.name}
                  track={track}
                  artist={track.artist.name}
                />
              ))
          }
        </tbody>
      </table>
      <div className='expand_button' onClick={toggleExpand}>
        <FontAwesome
          name={expanded ? 'angle-double-up' : 'angle-double-down'}
        />
      </div>
    </div>
);

export default compose(
  withTranslation('artist'),
  withState('expanded', 'setExpanded', false),
  withHandlers({
    toggleExpand: ({ expanded, setExpanded }) => () => setExpanded(!expanded),
    handleAddAll: ({ artist, tracks, addToQueue }) => () => 
      tracks
      // Change of WildLeons
      // Old version : .slice(0, expanded ? 15 : 5)
        .slice(0, tracks.length > 15 ? 15 : tracks.length)
        .map(track => {
          addToQueue({
            artist: artist.name,
            name: track.name,
            thumbnail: track.thumb || artPlaceholder
          });
        })
  })
)(PopularTracks);
