import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles.css';

import AlbumInfo from './AlbumInfo';
import AlbumOverlay from './AlbumOverlay';

class AlbumCover extends React.Component {

  render() {
    var style = {};

    if (this.props.nameOnly) {
      style = {
        backgroundImage: `url(${this.props.cover})`,
        height: '250px'
      };
    }

    return (
      <div style={style} className={styles.album_cover_container}>
        <AlbumOverlay
          handlePlay={this.props.handlePlay}
        />

        {
          this.props.nameOnly
          ? null
          : <img src={this.props.cover}/>
        }

        <AlbumInfo
          artist={this.props.artist}
          title={this.props.title}
          nameOnly={this.props.nameOnly}
        />
      </div>
    );
  }
}

AlbumCover.propTypes = {
  nameOnly: PropTypes.bool,
  cover: PropTypes.string,
  artist: PropTypes.string,
  title: PropTypes.string,
  handlePlay: PropTypes.func
};

export default AlbumCover;
