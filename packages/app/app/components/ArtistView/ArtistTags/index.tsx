import React from 'react';
import { useHistory } from 'react-router';

import styles from './styles.scss';

type ArtistTagsProps = {
  tags: string[];
}

export const ArtistTags: React.FC<ArtistTagsProps> = ({
  tags
}) => {
  const history = useHistory();
  const onTagClick = (tag: string) => history.push(`/tag/${tag}`);

  return (
    <div className={styles.tags_container}>
      {
        tags && tags.length > 0 &&
          tags.map((tag, i) => {
            return (
              <a
                href='#'
                onClick={() => onTagClick(tag)}
                key={i}
                className={styles.tag}
              >#{tag}</a>
            );
          })
      }
    </div>
  );
};

export default ArtistTags;
