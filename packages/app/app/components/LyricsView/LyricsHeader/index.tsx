import React from 'react';
import { useTranslation } from 'react-i18next';

import styles from './styles.scss';

type LyricsHeaderProps ={
  name : string;
  artist : string;
}

const LyricsHeader:React.FC<LyricsHeaderProps> = ({
  name = '',
  artist = ''
}) => {
  const { t } = useTranslation('lyrics');

  return (
    <div className={styles.lyrics_header}>
      <div className={styles.lyrics_header_name}>{ name }</div>
      <div className={styles.lyrics_header_artist}>{t('by-artist', { artist })}</div>
      <hr/>
    </div>
  );
};

export default LyricsHeader;
