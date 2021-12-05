import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';

import * as DownloadActions from '../../actions/downloads';
import * as SettingsActions from '../../actions/settings';
import { downloadsSelector } from '../../selectors/downloads';
import { settingsSelector } from '../../selectors/settings';
import Downloads from '../../components/Downloads';

const DownloadsContainer: React.FC = () => {
  const dispatch = useDispatch();
  const downloads = useSelector(downloadsSelector);
  const settings = useSelector(settingsSelector);

  useEffect(() => {
    dispatch(DownloadActions.readDownloads());
  }, [dispatch]);

  return (
    <Downloads
      downloads={downloads}
      downloadsDir={_.get(settings, 'downloads.dir')}
      clearFinishedTracks={() => dispatch(DownloadActions.clearFinishedDownloads())}
      pauseDownload={(uuid: string) => dispatch(DownloadActions.onDownloadPause(uuid))}
      resumeDownload={(uuid: string) => dispatch(DownloadActions.onDownloadResume(uuid))}
      removeDownload={(uuid: string) => dispatch(DownloadActions.onDownloadRemoved(uuid))}
      setStringOption={(option, state, fromMain) => dispatch(SettingsActions.setStringOption(option, state, fromMain))}
    />
  );
};

export default DownloadsContainer;
