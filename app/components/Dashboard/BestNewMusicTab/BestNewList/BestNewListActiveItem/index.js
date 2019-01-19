import React from 'react';

import styles from './styles.scss';

class BestNewListActiveItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { item, artistInfoSearchByName, history } = this.props;

    if (!item) {
      return null;
    }

    return (
      <div className={styles.best_new_active_item}>
        <div className={styles.thumbnail_box}>
          <div
            className={styles.item_thumbnail}
            style={{
              backgroundImage: `url(${item.thumbnail})`
            }}
          />
        </div>
        <div className={styles.review_box}>
          <div className={styles.header_row}>
            {item.score ? (
              <div className={styles.score}>{item.score}</div>
            ) : null}

            <div className={styles.artist_title_box}>
              <div className={styles.title}>{item.title}</div>
              <div className={styles.artist}>
                by{' '}
                <a
                  onClick={() => artistInfoSearchByName(item.artist, history)}
                  href='#'
                >
                  {item.artist}
                </a>
              </div>
            </div>
          </div>
          <div className={styles.review}>
            {item.abstract ? (
              <div className={styles.abstract}>{item.abstract}</div>
            ) : null}
            <div className={styles.review_content}>
              {item.review.split('\n').map(i => {
                return (

                  <div key={'item-' + i} className={styles.paragraph}>
                    {i}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default BestNewListActiveItem;
