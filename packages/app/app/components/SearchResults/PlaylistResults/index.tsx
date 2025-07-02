import React, { FC } from 'react';
import { get } from 'lodash';
import { useTranslation } from 'react-i18next';
import { Tab } from 'semantic-ui-react';
import FontAwesome from 'react-fontawesome';

import { TracksResults } from '../TracksResults';
import artPlaceholder from '../../../../resources/media/art_placeholder.png';
import parentStyles from '../styles.scss';

type PlaylistResultsProps = {
  playlistSearchStarted: boolean | string;
  playlistSearchResults: any;
  addToQueue: (track: any) => void;
  clearQueue: () => void;
  startPlayback: () => void;
  selectSong: (track: any) => void;
  loading?: boolean;
  attached?: boolean;
};

const PlaylistResults: FC<PlaylistResultsProps> = ({
  playlistSearchStarted,
  playlistSearchResults,
  addToQueue,
  loading = false,
  attached = false
}) => {
  const { t } = useTranslation('search');

  const addTrack = (track: any) => {
    if (typeof track !== 'undefined') {
      addToQueue({
        artist: track.artist,
        name: track.name,
        thumbnail: track.thumbnail ?? get(track, 'image[1][\'#text\']', artPlaceholder)
      });
    }
  };

  const renderAddAllButton = (tracks: any[]) => {
    return tracks.length > 0 ? (
      <a
        key='add-all-tracks-to-queue'
        href='#'
        onClick={() => {
          tracks.map(track => {
            addTrack(track);
          });
        }}
        aria-label={t('queue-add')}
      >
        <FontAwesome name='plus' /> Add all
      </a>
    ) : null;
  };

  const renderLoading = () => (
    <div>Loading... <FontAwesome name='spinner' pulse /></div>
  );

  const renderResults = () => (
    <div>
      {renderAddAllButton(playlistSearchResults.info)}
      <TracksResults
        tracks={playlistSearchResults.info}
        limit={100}
      />
    </div>
  );

  const renderNoResult = () => (
    <div>{t('empty')}</div>
  );

  const content = () => {
    if (!playlistSearchStarted) {
      return renderNoResult();
    }

    if (typeof playlistSearchStarted === 'string' && playlistSearchStarted.length > 0 && typeof playlistSearchResults.info === 'undefined') {
      return renderLoading();
    }

    return renderResults();
  };

  return (
    <Tab.Pane loading={loading} attached={attached}>
      <div className={parentStyles.pane_container}>
        {content()}
      </div>
    </Tab.Pane>
  );
};

export default PlaylistResults;
