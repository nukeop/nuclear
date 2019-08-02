import React from 'react';

import styles from './styles.scss';

const Cover = ({ cover }) => (
  <div className={styles.cover_container}>
    <img src={cover} />
  </div>
);

export default Cover;
