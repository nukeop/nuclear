import React from 'react';
import FontAwesome from 'react-fontawesome';
import { useTranslation } from 'react-i18next';

import { Button } from '@nuclear/ui';

import styles from './styles.scss';
import TrackTableContainer from '../../../containers/TrackTableContainer';
import { LastfmTagTopTrack } from '@nuclear/core/src/rest/Lastfm.types';

type TagTopTracksProps = {
  tracks: LastfmTagTopTrack[];
  addToQueue: (track: { artist: string; name: string; thumbnail: string }) => void;
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
      <TrackTableContainer
        tracks={tracks}
        displayAlbum={false}
        displayDeleteButton={false}
      />
    </div>
  );
};

export default TagTopTracks;
