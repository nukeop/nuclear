import React from 'react';

import styles from './styles.module.scss';

const TagDescription = ({ tagInfo }) => (
  <div className={styles.tag_description}>
    {tagInfo.wiki.summary
      .split('.')
      .slice(0, -5)
      .join('.') + '...'}
  </div>
);

export default TagDescription;
