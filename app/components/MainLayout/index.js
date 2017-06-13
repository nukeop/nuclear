import React from 'react';

import styles from './styles.css';

import AlbumCover from '../AlbumCover';

class MainLayout extends React.Component {
  render() {
    console.log(this.props);
    return (
      <div className={styles.main_layout_container + ' ' + this.props.className}>
        {this.props.children}
        <AlbumCover
          album={{
            artist: 'Black Sabbath',
            title: 'Master of Reality',
            cover: 'https://s-media-cache-ak0.pinimg.com/736x/3f/5c/1a/3f5c1a3e70e670ab52304a1cd0cf45e2.jpg'
          }}
        />
      </div>
    );
  }
}

export default MainLayout;
