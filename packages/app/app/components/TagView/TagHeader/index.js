import React from 'react';
import _ from 'lodash';

import styles from './styles.scss';

const TagHeader = ({ tag, topArtists }) => (
  <div className={styles.tag_header_container}>
    <div
      style={{
        backgroundImage: `url(${_.last(topArtists[0].image)['#text']})`
      }}
      className={styles.tag_header_background}
    />
    <div className={styles.tag_header_name}>#{tag}</div>
  </div>
);

export default TagHeader;
