import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import { NavLink } from 'react-router-dom';
import _ from 'lodash';

import * as appStyles from '../../styles.scss';
import styles from './styles.scss';

const PlaylistsSubMenu = props => {
  return (
    !props.compact && <div className={styles.playlists_submenu}>
      {
        _.map(props.playlists, (playlist, i) => {
          return (
            <NavLink
              to={'/playlist/' + i}
              activeClassName={appStyles.active_nav_link}
              key={playlist.name}
            >
              <div className={styles.playlists_submenu_entry}>
                <FontAwesome name='music'/> { playlist.name }
              </div>
            </NavLink>
          );
        })
      }
    </div>
  );
};

PlaylistsSubMenu.propTypes = {
  playlists: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      tracks: PropTypes.arrayOf(
        PropTypes.shape({
          uuid: PropTypes.string,
          artist: PropTypes.string,
          name: PropTypes.string,
          thumbnail: PropTypes.string
        })
      )
    })
  ),
  compact: PropTypes.bool
};

export default PlaylistsSubMenu;
