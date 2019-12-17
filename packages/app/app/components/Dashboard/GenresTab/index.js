import { SmoothImage } from '@nuclear/ui';
import React from 'react';
import { Tab } from 'semantic-ui-react';
import _ from 'lodash';

import genreToIcon from './mapGenres';
import styles from './styles.scss';

const bannedGenres = [
  'seen live'
];

class GenresTab extends React.Component {
  constructor(props) {
    super(props);
  }

  onGenreClick (genreName) {
    this.props.history.push('/tag/' + genreName);
  }

  render () {
    let {
      genres
    } = this.props;

    return (
      <Tab.Pane attached={false}>
        <div className={styles.genre_tab_container}>
          {
            typeof genres !== 'undefined'
              ? _.filter(genres, genre => !_.includes(bannedGenres, genre.name)).map((tag, i) => {
                return (
                  <div
                    className={styles.genre_container}
                    key={i}
                    onClick={() => this.onGenreClick(tag.name)}
                  >

                    <div className={styles.genre_overlay}>
                      <SmoothImage src={'https://picsum.photos/256?random=' + i} />
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
              : null
          }
        </div>
      </Tab.Pane>
    );
  }
}

export default GenresTab;
