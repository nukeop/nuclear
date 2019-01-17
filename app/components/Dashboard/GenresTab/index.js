import React from 'react';
import {Tab} from 'semantic-ui-react';
import Img from 'react-image-smooth-loading';

import styles from './styles.scss';

class GenresTab extends React.Component {
  constructor(props) {
    super(props);
  }

  onGenreClick(genreName) {
    this.props.history.push('/tag/' + genreName);
  }

  render() {
    let {
      genres
    } = this.props;

    return (
      <Tab.Pane attached={false}>
        <div className={styles.genre_tab_container}>
          {
            genres !== undefined
            ? genres.map((tag, i) => {
              return (
                <div
                  className={styles.genre_container}
                  key={i}
                  onClick={() => this.onGenreClick(tag.name)}
                >

                    <div className={styles.genre_overlay}>
                      <Img src={'https://picsum.photos/256x256/?random&seed=' + i} />
                      </div>
                      <div className={styles.genre_name}>
                        {tag.name}
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
