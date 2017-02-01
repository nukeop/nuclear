import React, { Component } from 'react';
import Coverflow from 'react-coverflow';

import styles from './CoverPreview.css';

export default class CoverPreview extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={styles.cover_preview_container}>

        <Coverflow
          width="300"
          height="150"
          displayQuantityOfSide={0.25}
          enableScroll={false}
          clickable={false}
          active={this.props.currentSongNumber}
        >
          {this.props.songQueue.map((song, i)=>{

            return (
              <img alt={song.data.title} src={song.data.thumbnail}/>
            );

          })}
        </Coverflow>

      </div>
    );
  }
}
