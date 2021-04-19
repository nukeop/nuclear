import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'semantic-ui-react';
import { useDispatch } from 'react-redux';

import * as PlaylistActions from '../../../actions/playlists';
import { openLocalFilePicker } from '../../../actions/local';

import Header from '../../Header';
import styles from './styles.scss';

type PlaylistsHeaderProps = {
  showText: boolean;
}

const PlaylistsHeader: React.FC<PlaylistsHeaderProps> = ({ showText }) => {
  const { t } = useTranslation('playlists');
  const dispatch = useDispatch();
  const handleImportFromFile = useCallback(async () => {
    const filePath = await openLocalFilePicker();
    dispatch(PlaylistActions.addPlaylistFromFile(filePath[0]));
  }, [dispatch]);

  return (
    <div className={styles.header_container}>
      {showText && <Header>{t('header')}</Header>}
      {!showText && <span />}

      <Button basic icon={'file text'} onClick={handleImportFromFile} data-testid='import-from-file'/>
      
    </div>
  );
};

export default PlaylistsHeader;
