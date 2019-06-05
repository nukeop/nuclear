import React from 'react';

import styles from './styles.scss';

const Cover = () => (
  <div className={styles.cover_container}>
    <img src={this.props.cover} />
  </div>
);

export default Cover;
