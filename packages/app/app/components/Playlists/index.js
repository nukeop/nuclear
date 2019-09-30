import React from 'react';
import { useTranslation } from 'react-i18next';

import Playlist from './Playlist';

import styles from './styles.scss';

const Playlists = ({ playlists }) => {
  const { t } = useTranslation('playlists');

  return (
    <div className={styles.playlists_container}>
      {(!playlists ||
        Object.keys(playlists).length === 0 ||
        playlists.length === 0) && <h3>{t('empty')}</h3>}
      {playlists &&
        playlists.length > 0 &&
        playlists.map((playlist, i) => {
          return (
            <Playlist playlist={playlist} history={history} index={i} key={i} />
          );
        })}
    </div>
  );
};

export default Playlists;
