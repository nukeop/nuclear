import React from 'react';
import { LastfmTag } from '@nuclear/core/src/rest/Lastfm.types';
import styles from './styles.scss';

interface TagDescriptionProps {
  tagInfo: LastfmTag;
}

const TagDescription: React.FC<TagDescriptionProps> = ({ tagInfo }) => (
  <div className={styles.tag_description}>
    {tagInfo?.wiki?.summary
      .split('.')
      .slice(0, -5)
      .join('.') + '...'}
  </div>
);

export default TagDescription;
