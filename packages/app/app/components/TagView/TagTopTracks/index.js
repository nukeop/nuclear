import React from 'react';
import FontAwesome from 'react-fontawesome';

import styles from './styles.scss';
import TrackRow from '../../TrackRow';
import { useTranslation } from 'react-i18next';
import { Button } from '@nuclear/ui';

const TagTopTracks = ({ tracks, addToQueue }) => {
  const { t } = useTranslation('tags');

  return (
    <div className={styles.tag_top_tracks}>
      <Button
        primary
        href='#'
        aria-label={t('queue-add')}
        onClick={() => {
          tracks.map((track) => {
            addToQueue({
              artist: track.artist.name,
              name: track.name,
              thumbnail: track.image[1]['#text']
            });
          });
        }}
        className={styles.add_all_button}
      >
        <FontAwesome name='plus' /> {t('queue-add')}
      </Button>
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
