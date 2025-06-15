import React, { FC, useMemo } from 'react';
import { get } from 'lodash';
import { Tab } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import { Card } from '@nuclear/ui';
import { 
  SearchResultsAlbum, 
  SearchResultsArtist, 
  SearchResultsTrack 
} from '@nuclear/core/src/plugins/plugins.types';

import { albumInfoSearch as albumInfoSearchAction, artistInfoSearch as artistInfoSearchAction } from '../../actions/search';
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

interface AllResultsPaneProps {
  loading: boolean;
  albumInfoSearch: (release?: SearchResultsAlbum) => void;
  artistInfoSearch: (artist?: SearchResultsArtist) => void;
}

const AllResultsPane: FC<AllResultsPaneProps> = ({ loading, albumInfoSearch, artistInfoSearch }) => (
  <Tab.Pane loading={loading} attached={false}>
    <div className={styles.pane_container}>
      <div className='row'>
        <AllResults
          albumInfoSearch={albumInfoSearch}
          artistInfoSearch={artistInfoSearch}
        />
      </div>
    </div>
  </Tab.Pane>
);

interface ResultsPaneProps<T extends SearchResultsAlbum | SearchResultsArtist> {
  collection: T[];
  loading: boolean;
  selectedProvider?: { searchName: string };
  onItemClick: (item: T) => void;
  emptyText: string;
}

const ResultsPane = <T extends SearchResultsAlbum | SearchResultsArtist>({
  collection,
  loading,
  selectedProvider,
  onItemClick,
  emptyText
}: ResultsPaneProps<T>) => {
  const getItemHeader = (item: T): string => {
    return (item as SearchResultsAlbum).title || (item as SearchResultsArtist).name;
  };

  const getItemContent = (item: T): string | undefined => {
    if ('artist' in item) {
      return item.artist;
    }
    return undefined;
  };

  return (
    <Tab.Pane loading={loading} attached={false}>
      <div className={styles.pane_container}>
        {collection.length > 0
          ? loading
            ? null
            : collection.map((el, i) => {
              const id = get(el, `ids.${selectedProvider?.searchName}`, el.id);
              return (
                <Card
                  key={`title-card-${i}`}
                  header={getItemHeader(el)}
                  content={getItemContent(el)}
                  image={el.coverImage || el.thumb}
                  onClick={() => onItemClick(el)} 
                />
              );
            })
          : emptyText}
      </div>
    </Tab.Pane>
  );
};

interface TrackListPaneProps {
  collection?: SearchResultsTrack[];
  loading: boolean;
  emptyText: string;
}

const TrackListPane: FC<TrackListPaneProps> = ({ collection, loading, emptyText }) => {
  if (!collection) {
    return (
      <Tab.Pane loading={loading} attached={false}>
        <div className={styles.pane_container}>{emptyText}</div>
      </Tab.Pane>
    );
  }

  return (
    <Tab.Pane loading={loading} attached={false}>
      <div className={styles.pane_container}>
        {collection.length > 0
          ? loading
            ? null
            : <TracksResults tracks={collection} limit={15} />
          : emptyText}
      </div>
    </Tab.Pane>
  );
};

interface PlaylistPaneProps {
  playlistSearchStarted: boolean | string;
  playlistSearchResults: unknown;
  addToQueue: (track: unknown) => void;
  clearQueue: () => void;
  startPlayback: (fromMain: boolean) => void;
  selectSong: (track: unknown) => void;
}

const PlaylistPane: FC<PlaylistPaneProps> = ({
  playlistSearchStarted,
  playlistSearchResults,
  addToQueue,
  clearQueue,
  startPlayback,
  selectSong
}) => (
  <Tab.Pane attached={false}>
    <PlaylistResults
      playlistSearchStarted={playlistSearchStarted}
      playlistSearchResults={playlistSearchResults}
      addToQueue={addToQueue}
      clearQueue={clearQueue}
      startPlayback={() => startPlayback(false)}
      selectSong={selectSong}
    />
  </Tab.Pane>
);

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
          <AllResultsPane
            loading={unifiedSearchStarted}
            albumInfoSearch={albumInfoSearch}
            artistInfoSearch={artistInfoSearch}
          />
        )
      },
      artistsHasResults && {
        menuItem: t('artist_plural'),
        render: () => (
          <ResultsPane
            collection={artistSearchResults}
            loading={unifiedSearchStarted}
            selectedProvider={selectedProvider}
            onItemClick={artistInfoSearch}
            emptyText={t('empty')}
          />
        )
      },
      albumsHasResults && {
        menuItem: t('album_plural'),
        render: () => (
          <ResultsPane
            collection={albumSearchResults}
            loading={unifiedSearchStarted}
            selectedProvider={selectedProvider}
            onItemClick={albumInfoSearch}
            emptyText={t('empty')}
          />
        )
      },
      tracksHasResults && {
        menuItem: t('track_plural'),
        render: () => (
          <TrackListPane
            collection={get(trackSearchResults, 'info', trackSearchResults)}
            loading={unifiedSearchStarted}
            emptyText={t('empty')}
          />
        )
      },
      playlistsHasResults && {
        menuItem: t('playlist'),
        render: () => (
          <PlaylistPane
            playlistSearchStarted={playlistSearchStarted}
            playlistSearchResults={playlistSearchResults}
            addToQueue={addToQueue}
            clearQueue={clearQueue}
            startPlayback={startPlayback}
            selectSong={selectSong}
          />
        )
      },
      liveStreamsHasResults && {
        menuItem: t('live-stream'),
        render: () => (
          <TrackListPane
            collection={liveStreamSearchResults?.info}
            loading={unifiedSearchStarted}
            emptyText={t('empty')}
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
