import React from 'react';
import FontAwesome from 'react-fontawesome';

import styles from './styles.scss';

class BestNewListActiveItem extends React.Component {
  constructor(props) {
    super(props);
  }

  renderThumbnail (item) {
    return (<div className={styles.thumbnail_box}>
      <div
        className={styles.item_thumbnail}
        style={{
          backgroundImage: `url(${item.thumbnail})`
        }}
      />
    </div>);
  }

  renderArtistTitleBox (item) {
    return (<div className={styles.artist_title_box}>
      <div className={styles.title}>
        {this.props.albumInfoSearchByName ? <a
          onClick={() => this.props.albumInfoSearchByName(item.title + ' ' + item.artist, this.props.history)}
          href='#'
        >
          {item.title}
        </a> : item.title}
      </div>
      <div className={styles.artist}>
        by{' '}
        <a
          onClick={() => this.props.artistInfoSearchByName(item.artist, this.props.history)}
          href='#'
        >
          {item.artist}
        </a>
      </div>
    </div>);
  }

  renderReview (item) {
    return (<div className={styles.review}>
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
    </div>);
  }

  addToQueue (item) {
    return this.props.addToQueue(this.props.musicSources, {
      artist: item.artist,
      name: item.title,
      thumbnail: item.thumbnail
    });
  }
  render () {
    let { item } = this.props;

    if (!item) {
      return null;
    }

    return (
      <div className={styles.best_new_active_item}>
        {this.renderThumbnail(item)}
        <div className={styles.review_box}>
          <div className={styles.header_row}>
            {item.score ? (
              <div className={styles.score}>{item.score}</div>
            ) : null}
            {this.renderArtistTitleBox(item)}
          </div>
          <div />
          <div>
            {!this.props.albumInfoSearchByName ? <div>
              <a
                onClick={() => {
                  this.props.clearQueue();
                  this.addToQueue(item);
                  this.props.selectSong(0);
                  this.props.startPlayback();
                }}
                href='#'
                className={styles.add_button}
              >
                <FontAwesome name='play' /> Play
              </a><a href='#' className={styles.add_button} onClick={() => {
                return this.addToQueue(item);
              }}><FontAwesome name='plus' /> Add to queue</a></div> : null}
          </div>
          {this.renderReview(item)}
        </div>
      </div>
    );
  }
}

export default BestNewListActiveItem;
