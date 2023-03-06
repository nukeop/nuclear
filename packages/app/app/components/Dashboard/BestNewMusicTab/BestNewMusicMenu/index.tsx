import React from 'react';
import { Menu } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';

import BestNewMusicCardContainer from '../../../../containers/BestNewMusicCardContainer';
import BestNewMusicCard from './BestNewMusicCard';

import styles from './styles.scss';
import { PitchforkAlbum, PitchforkTrack } from '../../../../actions/dashboard';

type BestNewMusicMenuProps = {
  albums: PitchforkAlbum[];
  setActiveItem: (activeItem: PitchforkAlbum | PitchforkTrack) => void;
  tracks: PitchforkTrack[];
}

const BestNewMusicMenu: React.FC<BestNewMusicMenuProps> = ({ albums, setActiveItem, tracks }) => {
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
          albums && albums.map(album => {
            return (
              <Menu.Item link key={album.title}>
                <BestNewMusicCard
                  item={album}
                  onClick={setActiveItem}
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
          tracks && tracks.map(track => {
            return (
              <Menu.Item link key={track.title}>
                <BestNewMusicCardContainer
                  item={track}
                  onClick={setActiveItem}
                  withFavoriteButton
                />
              </Menu.Item>
            );
          })
        }
      </Menu>
    </div>
  );
};

export default BestNewMusicMenu;
