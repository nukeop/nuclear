import React from 'react';

import styles from './styles.scss';

class ArtistTags extends React.Component {
  constructor(props) {
    super(props);
  }

  onTagClick(tag) {
    this.props.history.push('/tag/' + tag);
  }

  render() {
    return (
      <div className={styles.tags_container}>
        {
          this.props.tags && this.props.tags.length > 0 &&
          this.props.tags.map((el, i) => {
            return (
              <a
                href='#'
                onClick={() => this.onTagClick.bind(this)(el.name)}
                key={i}
                className={styles.tag}
                >#{el.name}</a>
              );
            })
        }
      </div>
    );
  }
}

export default ArtistTags;
