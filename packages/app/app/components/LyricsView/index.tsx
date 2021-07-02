import React from 'react';
import _ from 'lodash';
import { Icon } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';

import LyricsHeader from './LyricsHeader';

import styles from './styles.scss';

export type LyricsViewProps = {
  showHeader: boolean;
  lyricsSearchResults: {
    type: string;
  };
  trackName: string;
  trackArtist: string;
}

export const LyricsView: React.FC<LyricsViewProps> = ({
  showHeader,
  lyricsSearchResults,
  trackName,
  trackArtist
}) => {
  const { t } = useTranslation('lyrics');
  let lyricsStr = _.get(lyricsSearchResults, 'type', '');
  if (lyricsStr === '') {
    lyricsStr = t('not-found');
  }

  return <div className={styles.lyrics_view}>
    {
      !trackName &&
      <div className={styles.empty_state}>
        <Icon name='music' />
        <h2>{t('empty')}</h2>
        <div>{t('empty-help')}</div>
      </div>
    }
    {
      Boolean(trackName) &&
      <> 
        {
          showHeader &&
          <LyricsHeader
            name={trackName}
            artist={trackArtist}
          />
        }
        <div className={styles.lyrics_text}>
          {lyricsStr}
        </div>
      </>
    }
  </div>;
};

export default LyricsView;
