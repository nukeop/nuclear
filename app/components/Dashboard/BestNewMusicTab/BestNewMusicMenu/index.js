import React from 'react';
import PropTypes from 'prop-types';
import { Menu } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';

import BestNewMusicCardContainer from '../../../../containers/BestNewMusicCardContainer';
import ItemType from '../../../../constants/itemType';
import { bestNewItemShape } from './BestNewMusicCard';

import styles from './styles.scss';

const BestNewMusicMenu = ({ albums, setActiveItem, tracks }) => {
  const { t } = useTranslation('dashboard');

  return (
    <div className={styles.best_new_music_menu}>
      <Menu vertical size='large'>
        <Menu.Item
          className={styles.best_new_music_menu_header}
          link
        >
          {t('best-new-albums')}
        </Menu.Item>
        {
          albums.map(album => {
            return (
              <Menu.Item link key={album.title}>
                <BestNewMusicCardContainer
                  item={album}
                  onClick={() => setActiveItem(album)}
                  type={ItemType.ALBUM}
                />
              </Menu.Item>
            );
          })
        }

        <Menu.Item
          className={styles.best_new_music_menu_header}
          link
        >
          {t('best-new-tracks')}
        </Menu.Item>
        {
          tracks.map(track => {
            return (
              <Menu.Item link key={track.title}>
                <BestNewMusicCardContainer
                  item={track}
                  onClick={() => setActiveItem(track)}
                  type={ItemType.TRACK}
                />
              </Menu.Item>
            );
          })
        }
      </Menu>
    </div>
  );
};

BestNewMusicMenu.propTypes = {
  albums: PropTypes.arrayOf(bestNewItemShape),
  tracks: PropTypes.arrayOf(bestNewItemShape),
  setActiveItem: PropTypes.func
};

export default BestNewMusicMenu;
