import React, { FC, useCallback, useMemo } from 'react';
import { get } from 'lodash';
import { Tab } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import { Card } from '@nuclear/ui';
import { 
  SearchResultsAlbum, 
  SearchResultsArtist, 
  SearchResultsPodcast, 
  SearchResultsTrack 
} from '@nuclear/core/src/plugins/plugins.types';

import { albumInfoSearch as albumInfoSearchAction, artistInfoSearch as artistInfoSearchAction, podcastSearch as podcastSearchAction } from '../../actions/search';
import {clearQueue as clearQueueAction, selectSong as selectSongAction} from '../../actions/queue';
import {startPlayback as startPlaybackAction} from '../../actions/player';
import { AllResults } from './AllResults';
import { TracksResults } from './TracksResults';
import PlaylistResults from './PlaylistResults';

import styles from './styles.scss';
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
  const podcastSearchResults = useSelector(searchSelectors.podcastSearchResults);

  const selectedProvider = useMemo(() => 
    metaProviders.find(provider => provider.sourceName === selectedPlugins.metaProviders),
  [metaProviders, selectedPlugins.metaProviders]
  );

  const albumInfoSearch = useCallback((albumId: string, releaseType?: 'master' | 'release', release?: SearchResultsAlbum) => {
    dispatch(albumInfoSearchAction(albumId, releaseType, release));
    history.push(`/album/${albumId}`);
  }, [albumInfoSearchAction, history]);

  const artistInfoSearch = useCallback((artistId: string, artist: SearchResultsArtist) => {
    dispatch(artistInfoSearchAction(artistId, artist ));
    history.push(`/artist/${artistId}`);
  }, [artistInfoSearchAction, history]);

  const podcastInfoSearch = useCallback((podcastId: string, releaseType?: 'master' | 'release', release?: SearchResultsPodcast) => {
    dispatch(podcastSearchAction(podcastId));
    history.push(`/album/${podcastId}`);
  }, [podcastSearchAction, history]);

  const addToQueue = useDispatchedCallback(addToQueueAction);
  const clearQueue = useDispatchedCallback(clearQueueAction);
  const startPlayback = useDispatchedCallback(startPlaybackAction);
  const selectSong = useDispatchedCallback(selectSongAction);

  const renderAllResultsPane = useCallback(() => (
    <Tab.Pane loading={unifiedSearchStarted} attached={false}>
      <div className={styles.pane_container}>
        <div className='row'>
          <AllResults />
        </div>
      </div>
    </Tab.Pane>
  ), [unifiedSearchStarted]);

  const getItemHeader = useCallback((item: SearchResultsAlbum | SearchResultsArtist | SearchResultsPodcast): string => {
    return (item as SearchResultsAlbum | SearchResultsPodcast).title || (item as SearchResultsArtist).name;
  }, []);

  const getItemContent = useCallback((item: SearchResultsAlbum | SearchResultsArtist | SearchResultsPodcast): string | undefined => {
    if ('artist' in item) {
      return item.artist;
    }
    if ('author' in item) {
      return item.author;
    }
    return undefined;
  }, []);

  const getItemType = useCallback((item: SearchResultsAlbum | SearchResultsArtist | SearchResultsPodcast): string | undefined => {
    return 'type' in item ? item.type : undefined;
  }, []);

  const renderPane = useCallback(<T extends SearchResultsAlbum | SearchResultsArtist | SearchResultsPodcast>(
    collection: T[], 
    onClick: (id: string, type?: string) => void
  ) => {
    return (
      <Tab.Pane loading={unifiedSearchStarted} attached={false}>
        <div className={styles.pane_container}>
          {collection.length > 0
            ? unifiedSearchStarted
              ? null
              : collection.map((el, i) => {
                const id = get(el, `ids.${selectedProvider?.searchName}`, el.id);
                return (
                  <Card
                    key={`title-card-${i}`}
                    header={getItemHeader(el)}
                    content={getItemContent(el)}
                    image={el.coverImage || el.thumb}
                    onClick={() => onClick(id, getItemType(el))} />
                );
              })
            : t('empty')}
        </div>
      </Tab.Pane>
    );
  }, [unifiedSearchStarted, selectedProvider, t, getItemHeader, getItemContent, getItemType]);

  const renderTrackListPane = useCallback((collection?: SearchResultsTrack[]) => {
    if (!collection) {
      return (
        <Tab.Pane loading={unifiedSearchStarted} attached={false}>
          <div className={styles.pane_container}>{t('empty')}</div>
        </Tab.Pane>
      );
    }

    return (
      <Tab.Pane loading={unifiedSearchStarted} attached={false}>
        <div className={styles.pane_container}>
          {collection.length > 0
            ? unifiedSearchStarted
              ? null
              : <TracksResults tracks={collection} limit={15} />
            : t('empty')}
        </div>
      </Tab.Pane>
    );
  }, [unifiedSearchStarted, t]);

  const renderPlaylistPane = useMemo(() => (
    <Tab.Pane attached={false}>
      <PlaylistResults
        playlistSearchStarted={playlistSearchStarted}
        playlistSearchResults={playlistSearchResults}
        addToQueue={addToQueue}
        clearQueue={clearQueue}
        startPlayback={startPlayback}
        selectSong={selectSong}
      />
    </Tab.Pane>
  ), [playlistSearchStarted, playlistSearchResults, addToQueue, clearQueue, startPlayback, selectSong]);

  const panes = useMemo(() => {
    const artistsHasResults = artistSearchResults.length > 0;
    const albumsHasResults = albumSearchResults.length > 0;
    const tracksHasResults = get(trackSearchResults, ['info', 'length'], trackSearchResults.length) > 0;
    const playlistsHasResults = get(playlistSearchResults, ['info', 'length'], 0) > 0;
    const liveStreamsHasResults = get(liveStreamSearchResults, ['info', 'length'], 0) > 0;
    const podcastsHasResults = podcastSearchResults.length > 0;

    return [
      {
        menuItem: t('all'),
        render: renderAllResultsPane
      },
      artistsHasResults && {
        menuItem: t('artist_plural'),
        render: () => renderPane(artistSearchResults, artistInfoSearch)
      },
      albumsHasResults && {
        menuItem: t('album_plural'),
        render: () => renderPane(albumSearchResults, albumInfoSearch)
      },
      tracksHasResults && {
        menuItem: t('track_plural'),
        render: () => renderTrackListPane(get(trackSearchResults, 'info', trackSearchResults))
      },
      playlistsHasResults && {
        menuItem: t('playlist'),
        render: renderPlaylistPane
      },
      liveStreamsHasResults && {
        menuItem: t('live-stream'),
        render: () => renderTrackListPane(get(liveStreamSearchResults, 'info'))
      },
      podcastsHasResults && {
        menuItem: t('podcast'),
        render: () => renderPane(podcastSearchResults, podcastInfoSearch)
      }
    ].filter(Boolean);
  }, [
    artistSearchResults, albumSearchResults, trackSearchResults, 
    playlistSearchResults, liveStreamSearchResults, podcastSearchResults,
    t, renderAllResultsPane, renderPane, renderTrackListPane, renderPlaylistPane,
    artistInfoSearch, albumInfoSearch, podcastInfoSearch
  ]);

  return (
    <div>
      <Tab menu={{ secondary: true, pointing: true }} panes={panes} />
    </div>
  );
};

export default SearchResults;
