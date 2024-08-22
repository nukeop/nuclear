import React, { useEffect, useRef } from 'react';
import { Icon } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';

import LyricsHeader from './LyricsHeader';

import styles from './styles.scss';
import { QueueItem } from '../../reducers/queue';
import { getTrackArtists } from '@nuclear/ui';

type LyricsViewProps = {
  lyricsSearchResult: string
  track?: QueueItem;
}

export const LyricsView: React.FC<LyricsViewProps> = ({
  lyricsSearchResult,
  track
}) => {
  const { t } = useTranslation('lyrics');
  const lyricsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (lyricsRef.current) {
      lyricsRef.current.scrollTop = 0;
    }
  }, [lyricsSearchResult]);

  return <div className={styles.lyrics_view} ref={lyricsRef}>
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
          artist={getTrackArtists(track)?.[0]}
        />
        <div className={styles.lyrics_text}>
          {lyricsSearchResult || t('not-found')}
        </div>
      </>
    }
  </div>;
};

export default LyricsView;
