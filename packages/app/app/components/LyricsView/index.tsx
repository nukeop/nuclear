import React from 'react';
import _ from 'lodash';
import { Icon } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';

import LyricsHeader from './LyricsHeader';

import styles from './styles.scss';

type LyricsViewProps = {
  lyricsSearchResults: {
    type: string;
  };
  track?: {
    name: string;
    artist: string;
  };
}

export const LyricsView: React.FC<LyricsViewProps> = ({
  lyricsSearchResults,
  track
}) => {
  const { t } = useTranslation('lyrics');
  let lyricsStr = _.get(lyricsSearchResults, 'type', '');
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
          artist={track.artist}
        />
        <div className={styles.lyrics_text}>
          {lyricsStr}
        </div>
      </>
    }
  </div>;
};

export default LyricsView;
