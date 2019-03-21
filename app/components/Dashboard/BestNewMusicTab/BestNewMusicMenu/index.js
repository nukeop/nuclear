import React from 'react';
import PropTypes from 'prop-types';
import { Menu } from 'semantic-ui-react';

import BestNewMusicCard from './BestNewMusicCard';

import styles from './styles.scss';

const BestNewMusicMenu = props => {
  return (
    <div className={styles.best_new_music_menu}>
      <Menu vertical size='large'>
        <Menu.Item
          className={styles.best_new_music_menu_header}
          link
        >
          Best new albums
        </Menu.Item>
        {
          props.albums.map(album => {
            return (
              <Menu.Item link key={ album.title }>
                <BestNewMusicCard
                  item={ album }
                  onClick={ () => props.setActiveItem(album )}
                />
              </Menu.Item>
            );
          })
        }

        <Menu.Item
          className={styles.best_new_music_menu_header}
          link
        >
      Best new tracks
        </Menu.Item>
        {
          props.tracks.map(track => {
            return (
              <Menu.Item link key={ track.title }>
                <BestNewMusicCard
                  item={ track }
                  onClick={ () => props.setActiveItem(track)}
                />
              </Menu.Item>
            );
          })
        }
      </Menu>
    </div>
  );
};

export const bestNewItemShape = PropTypes.shape({
  title: PropTypes.string,
  artist: PropTypes.string,
  thumbnail: PropTypes.string,
  score: PropTypes.string,
  abstract: PropTypes.string,
  review: PropTypes.string
});

BestNewMusicMenu.propTypes = {
  albums: PropTypes.arrayOf(bestNewItemShape),
  tracks: PropTypes.arrayOf(bestNewItemShape),
  setActiveItem: PropTypes.func
};

export default BestNewMusicMenu;
