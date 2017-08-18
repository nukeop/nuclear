import React from 'react';

import styles from './styles.scss';

class ArtistTags extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={styles.tags_container}>
        {
          this.props.tags && this.props.tags.length > 0
          ? this.props.tags.map((el, i) => {
              return (
                <span key={i} className={styles.tag}>#{el.name}</span>
              );
            })
          : null
        }
      </div>
    );
  }
}

export default ArtistTags;
