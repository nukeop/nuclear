import React, { Component } from 'react';
import styles from './Playlists.css';

export default class Playlists extends Component {
  constructor(props) {
    super(props);
  }

  render() {
      return (
        <div className={styles.playlists_container}>
          List of all playlists
        </div>
      );
  }
}
