import React, { FC, useMemo } from 'react';
import { get } from 'lodash';
import { Tab } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import { 
  SearchResultsAlbum, 
  SearchResultsArtist 
} from '@nuclear/core/src/plugins/plugins.types';

import { albumInfoSearch as albumInfoSearchAction, artistInfoSearch as artistInfoSearchAction } from '../../actions/search';
import {clearQueue as clearQueueAction, selectSong as selectSongAction} from '../../actions/queue';
import {startPlayback as startPlaybackAction} from '../../actions/player';
import { AllResults } from './AllResults';
import { TracksResults } from './TracksResults';
import PlaylistResults from './PlaylistResults';
import ItemResults from './ItemResults';

import { useDispatch, useSelector } from 'react-redux';
import { pluginsSelectors } from '../../selectors/plugins';
import { useHistory } from 'react-router';
import { searchSelectors } from '../../selectors/search';
import { useDispatchedCallback } from '../../hooks/useDispatchedCallback';
import { addToQueue as addToQueueAction } from '../../actions/queue';

const SearchResults: FC = () => {
  const { t } = useTranslation('search');
  const dispatch = useDispatch();
  const history = useHistory();

  const { metaProviders } = useSelector(pluginsSelectors.plugins);
  const selectedPlugins = useSelector(pluginsSelectors.selected);
  const unifiedSearchStarted = useSelector(searchSelectors.unifiedSearchStarted);
  const playlistSearchStarted = useSelector(searchSelectors.playlistSearchStarted);
  const playlistSearchResults = useSelector(searchSelectors.playlistSearchResults);
  const trackSearchResults = useSelector(searchSelectors.trackSearchResults);
  const albumSearchResults = useSelector(searchSelectors.albumSearchResults);
  const artistSearchResults = useSelector(searchSelectors.artistSearchResults);
  const liveStreamSearchResults = useSelector(searchSelectors.liveStreamSearchResults);

  const selectedProvider = useMemo(() => 
    metaProviders.find(provider => provider.sourceName === selectedPlugins.metaProviders),
  [metaProviders, selectedPlugins.metaProviders]
  );

  const albumInfoSearch = (release?: SearchResultsAlbum) => {
    dispatch(albumInfoSearchAction(release));
    history.push(`/album/${release?.id}`);
  };

  const artistInfoSearch = (artist?: SearchResultsArtist) => {
    dispatch(artistInfoSearchAction(artist));
    history.push(`/artist/${artist?.id}`);
  };

  const addToQueue = useDispatchedCallback(addToQueueAction);
  const clearQueue = useDispatchedCallback(clearQueueAction);
  const startPlayback = useDispatchedCallback(startPlaybackAction);
  const selectSong = useDispatchedCallback(selectSongAction);

  const panes = useMemo(() => {
    const artistsHasResults = artistSearchResults.length > 0;
    const albumsHasResults = albumSearchResults.length > 0;
    const tracksHasResults = get(trackSearchResults, ['info', 'length'], trackSearchResults.length) > 0;
    const playlistsHasResults = get(playlistSearchResults, ['info', 'length'], 0) > 0;
    const liveStreamsHasResults = get(liveStreamSearchResults, ['info', 'length'], 0) > 0;

    return [
      {
        menuItem: t('all'),
        render: () => (
          <AllResults
            loading={unifiedSearchStarted}
            attached={false}
            albumInfoSearch={albumInfoSearch}
            artistInfoSearch={artistInfoSearch}
          />
        )
      },
      artistsHasResults && {
        menuItem: t('artist_plural'),
        render: () => (
          <ItemResults
            collection={artistSearchResults}
            loading={unifiedSearchStarted}
            attached={false}
            selectedProvider={selectedProvider}
            onItemClick={artistInfoSearch}
            emptyText={t('empty')}
          />
        )
      },
      albumsHasResults && {
        menuItem: t('album_plural'),
        render: () => (
          <ItemResults
            collection={albumSearchResults}
            loading={unifiedSearchStarted}
            attached={false}
            selectedProvider={selectedProvider}
            onItemClick={albumInfoSearch}
            emptyText={t('empty')}
          />
        )
      },
      tracksHasResults && {
        menuItem: t('track_plural'),
        render: () => (
          <TracksResults
            tracks={get(trackSearchResults, 'info', trackSearchResults)}
            limit={15}
            loading={unifiedSearchStarted}
            attached={false}
            asPane={true}
          />
        )
      },
      playlistsHasResults && {
        menuItem: t('playlist'),
        render: () => (
          <PlaylistResults
            playlistSearchStarted={playlistSearchStarted}
            playlistSearchResults={playlistSearchResults}
            addToQueue={addToQueue}
            clearQueue={clearQueue}
            startPlayback={() => startPlayback(false)}
            selectSong={selectSong}
            loading={false}
            attached={false}
          />
        )
      },
      liveStreamsHasResults && {
        menuItem: t('live-stream'),
        render: () => (
          <TracksResults
            tracks={liveStreamSearchResults?.info}
            limit={15}
            loading={unifiedSearchStarted}
            attached={false}
            asPane={true}
          />
        )
      }
    ].filter(Boolean);
  }, [
    artistSearchResults, albumSearchResults, trackSearchResults, 
    playlistSearchResults, liveStreamSearchResults,
    unifiedSearchStarted, selectedProvider, t,
    albumInfoSearch, artistInfoSearch,
    playlistSearchStarted, addToQueue, clearQueue, startPlayback, selectSong
  ]);

  return (
    <div>
      <Tab menu={{ secondary: true, pointing: true }} panes={panes} />
    </div>
  );
};

export default SearchResults;
