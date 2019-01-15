import React from 'react';

import Card from '../../Card';

import styles from './styles.scss';

class AllResults extends React.Component {
  constructor(props) {
    super(props);
  }

  renderResults(collection, onClick) {
    return collection.slice(0, 5).map((el, i) => {
      return (
        <Card
          small
          header={el.title}
          image={el.thumb}
          onClick={() => onClick(el.id)}
          key={i}
        />
      );
    });
  }

  renderLastFmResults(collection) {
    let addToQueue = this.props.addToQueue;
    return collection.slice(0, 5).map((el, i) => {
      return (
        <Card
          small
          header={el.name + ' - ' + el.artist}
          image={el.image[2]['#text']}
          onClick={() => {
            addToQueue(this.props.musicSources, {
              artist: el.name,
              name: el.name,
              thumbnail: el.image[1]['#text'],
            });
          }}
          key={i}
        />
      );
    });
  }

  render() {
    if (
      this.props.artistSearchResults.length <= 0 &&
      this.props.albumSearchResults.length <= 0 &&
      this.props.trackSearchResults.length <= 0
    ) {
      return <div>Nothing found.</div>;
    }

    return (
      <div className={styles.all_results_container}>
        <div className={styles.column}>
          <h3>Artists</h3>
          <div className={styles.row}>
            {this.renderResults(
              this.props.artistSearchResults,
              this.props.artistInfoSearch
            )}
          </div>
        </div>

        <div className={styles.column}>
          <h3>Albums</h3>
          <div className={styles.row}>
            {this.renderResults(
              this.props.albumSearchResults,
              this.props.albumInfoSearch
            )}
          </div>
        </div>

        <div className={styles.column}>
          <h3>Tracks</h3>
          <div className={styles.row}>
            {this.renderLastFmResults(this.props.trackSearchResults.info)}
          </div>
        </div>
      </div>
    );
  }
}

export default AllResults;
