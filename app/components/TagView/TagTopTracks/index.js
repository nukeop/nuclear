import React from 'react';
import FontAwesome from 'react-fontawesome';

import styles from './styles.scss';
import TrackRow from '../../TrackRow';
import { useTranslation } from 'react-i18next';

const TagTopTracks = ({ tracks, addToQueue, musicSources }) => {
  const { t } = useTranslation('tags');

  return (
    <div className={styles.tag_top_tracks}>
      <a
        href='#'
        key='add-all-tag-tracks-to-queue'
        className='add_all_button'
        onClick={() => {
          tracks.map((track) => {
            addToQueue(musicSources, {
              artist: track.artist.name,
              name: track.name,
              thumbnail: track.image[1]['#text']
            });
          });
        }}
        aria-label={t('queue-add')}
      >
        <FontAwesome name='plus' /> {t('queue-add')}
      </a>
      <table>
        <thead>
          <tr>
            <th>
              <FontAwesome name='photo' />
            </th>
            <th>{t('artist')}</th>
            <th>{t('title')}</th>
            <th style={{ textAlign: 'center' }}>{t('duration')}</th>
          </tr>
        </thead>
        <tbody>
          {tracks.map((track, index) => {
            return < TrackRow
              key={'tag-track-row-' + index}
              track={track}
              index={'popular-track-' + index}
              artist={track.artist}
              displayCover
              displayArtist
              displayDuration
            />;
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TagTopTracks;
