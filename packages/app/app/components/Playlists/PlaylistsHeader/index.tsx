import React from 'react';
import { useTranslation } from 'react-i18next';

import styles from './styles.scss';

type PlaylistsHeaderProps = {
  showText: boolean;
}

const PlaylistsHeader: React.FC<PlaylistsHeaderProps> = ({showText}) => {
  const { t } = useTranslation('playlists');

  return (
    <div className={styles.header_container}>
      {showText && t('header')}
    </div>
  );
};

export default PlaylistsHeader;
