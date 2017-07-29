import React from 'react';

import styles from './styles.scss';

class Cover extends React.Component {

  render() {
    return (
      <div className={styles.cover_container}>
        <img src={this.props.cover} />
      </div>
    );
  }
}

export default Cover;
