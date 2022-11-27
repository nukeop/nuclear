import React from 'react';

import { StreamData } from '@nuclear/core/src/plugins/plugins.types';

import styles from './styles.scss';

export const StreamOption: React.FC<StreamData> = ({ title, author, thumbnail }) => (
  <div className={styles.stream_option}>
    <div className={styles.stream_option_thumbnail}>
      <img src={thumbnail} />
      <div className={styles.stream_option_thumbnail_overlay} />
    </div>
    <div className={styles.stream_option_title}>
      {title}
    </div>
    {
      author?.name &&
      <div className={styles.stream_option_author}>
        {author.name}
      </div>
    }
  </div>
);
