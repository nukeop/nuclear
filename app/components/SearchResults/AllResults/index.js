import React from 'react';

import Card from '../../Card';

import styles from './styles.scss';

class AllResults extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={styles.all_results_container}>

        <div className={styles.column}>
        <h3>Artists</h3>
        <div className={styles.row}>
        {
          this.props.artistSearchResults.slice(0, 3).map((el, i) => {
            return (
              <Card
                small
                header={el.title}
                image={el.thumb}
              />
            )
          })
        }
        </div>
        </div>

        <div className={styles.column}>
        <h3>Albums</h3>
        <div className={styles.row}>
        {
          this.props.albumSearchResults.slice(0, 3).map((el, i) => {
            return (
              <Card
                small
                header={el.title}
                image={el.thumb}
              />
            )
          })
        }
        </div>
        </div>


      </div>
    );
  }
}

export default AllResults;
