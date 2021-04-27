import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'semantic-ui-react';

import Header from '../../Header';
import styles from './styles.scss';

type PlaylistsHeaderProps = {
  showText: boolean;
  handleImportFromFile: React.MouseEventHandler;
}

const PlaylistsHeader: React.FC<PlaylistsHeaderProps> = ({ showText, handleImportFromFile }) => {
  const { t } = useTranslation('playlists');

  return (
    <div className={styles.header_container}>
      {showText && <Header>{t('header')}</Header>}
      {!showText && <span />}

      <Button basic icon={'file text'} onClick={handleImportFromFile} data-testid='import-from-file'/>
      
    </div>
  );
};

export default PlaylistsHeader;
