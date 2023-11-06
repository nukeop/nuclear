import React from 'react';
import { Icon } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';

import LyricsHeader from './LyricsHeader';

import styles from './styles.scss';
import { QueueItem } from '../../reducers/queue';
import { getTrackArtist } from '@nuclear/ui';

type LyricsViewProps = {
  lyricsSearchResults: {
    type: string;
  };
  track?: QueueItem;
}

export const LyricsView: React.FC<LyricsViewProps> = ({
  lyricsSearchResults,
  track
}) => {
  const { t } = useTranslation('lyrics');
  let lyricsStr = lyricsSearchResults?.type ?? ''; 
  if (lyricsStr === '') {
    lyricsStr = t('not-found');
  }

  return <div className={styles.lyrics_view}>
    {
      !track &&
      <div className={styles.empty_state}>
        <Icon name='music' />
        <h2>{t('empty')}</h2>
        <div>{t('empty-help')}</div>
      </div>
    }
    {
      Boolean(track) &&
      <>
        <LyricsHeader
          name={track.name}
          artist={getTrackArtist(track)}
        />
        <div className={styles.lyrics_text}>
          {lyricsStr}
        </div>
      </>
    }
  </div>;
};

export default LyricsView;
