import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import styles from './styles.scss';

const LyricsHeader = ({ name, artist }) => {
  const { t } = useTranslation('lyrics');

  return (
    <div className={styles.lyrics_header}>
      <div className={styles.lyrics_header_name}>{ name }</div>
      <div className={styles.lyrics_header_artist}>{t('by-artist', { artist })}</div>
      <hr/>
    </div>
  );
};

LyricsHeader.propTypes = {
  name: PropTypes.string,
  artist: PropTypes.string
};

LyricsHeader.defaultProps = {
  name: '',
  artist: ''
};

export default LyricsHeader;
