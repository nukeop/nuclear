import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles.scss';

const LyricsHeader = props => {
  return (
    <div className={styles.lyrics_header}>
      <div className={styles.lyrics_header_name}>{ props.name }</div>
      <div className={styles.lyrics_header_artist}>by { props.artist
      }</div>
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
