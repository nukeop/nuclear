import React from 'react';
import FontAwesome from 'react-fontawesome';
import { useTranslation } from 'react-i18next';

import { Button, TrackTable } from '@nuclear/ui';

import styles from './styles.scss';
import TrackRow from '../../TrackRow';
import TrackTableContainer from '../../../containers/TrackTableContainer';

type TagTopTrack = {
  artists: string[];
  name: string;
  image: { '#text': string }[];
};

type TagTopTracksProps = {
  tracks: TagTopTrack[];
  addToQueue: (track: { artists: string[]; name: string; thumbnail: string }) => void;
}

const TagTopTracks: React.FC<TagTopTracksProps> = ({ tracks, addToQueue }) => {
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
              artists: track.artists,
              name: track.name,
              thumbnail: track.image[1]['#text']
            });
          });
        }}
        className={styles.add_all_button}
      >
        <FontAwesome name='plus' /> {t('queue-add')}
      </Button>
      <TrackTableContainer
        tracks={tracks}
        displayAlbum={false}
        displayDeleteButton={false}
      />
    </div>
  );
};

export default TagTopTracks;
