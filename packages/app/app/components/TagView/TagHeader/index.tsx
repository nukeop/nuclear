import React from 'react';
import _ from 'lodash';
import { LastfmArtistShort } from '@nuclear/core/src/rest/Lastfm.types';

import styles from './styles.scss';

type TagHeaderProps = {
  tag: string;
  topArtists: LastfmArtistShort[];
}

const TagHeader: React.FC<TagHeaderProps> = ({ tag, topArtists = [] }) => (
  <div className={styles.tag_header_container}>
    <div
      style={{
        backgroundImage: `url(${_.last(topArtists[0]?.image)?.['#text']})`
      }}
      className={styles.tag_header_background}
    />
    <div className={styles.tag_header_name}>#{tag}</div>
  </div>
);

export default TagHeader;
