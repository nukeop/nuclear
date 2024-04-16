import { SmoothImage } from '@nuclear/ui';
import React from 'react';
import { Tab } from 'semantic-ui-react';
import _ from 'lodash';

import genreToIcon from './mapGenres';
import styles from './styles.scss';
import { LastfmTopTag } from '@nuclear/core/src/rest/Lastfm.types';
import { useHistory } from 'react-router-dom';

const bannedGenres = [
  'seen live'
];

type GenresTabProps = {
  genres: LastfmTopTag[]
}

const GenresTab: React.FC<GenresTabProps> = ({ genres }) => {
  const history = useHistory();

  function onGenreClick(genreName: string) {
    history.push(`/tag/${genreName}`);
  }

  return (
    <Tab.Pane attached={false}>
      <div className={styles.genre_tab_container}>
        {
          _.filter(genres, genre => !_.includes(bannedGenres, genre.name)).map((tag, i) => {
            return (
              <div
                className={styles.genre_container}
                key={i}
                onClick={() => onGenreClick(tag.name)}
              >
                <div className={styles.genre_overlay}>
                  <SmoothImage src={`https://picsum.photos/256?random=${i}`} />
                </div>
                <div className={styles.genre_name}>
                  <div
                    className={styles.svg_icon}
                    dangerouslySetInnerHTML={{ __html: genreToIcon(tag.name) }}
                  />
                  { tag.name }
                </div>
              </div>
            );
          })
        }
      </div>
    </Tab.Pane>
  );
};

export default GenresTab;
