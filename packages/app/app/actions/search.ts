import { logger } from '@nuclear/core';
import { rest } from '@nuclear/core';
import _, { isString } from 'lodash';
import artPlaceholder from '../../resources/media/art_placeholder.png';
import globals from '../globals';
import { error } from './toasts';
import { Search } from './actionTypes';
import { History } from 'history';
import { RootState } from '../reducers';
import { AlbumDetails, ArtistDetails, SearchResultsAlbum, SearchResultsArtist, SearchResultsPodcast, SearchResultsSource } from '@nuclear/core/src/plugins/plugins.types';
import { createStandardAction } from 'typesafe-actions';
import { LastfmTrackMatch, LastfmTrackMatchInternal } from '@nuclear/core/src/rest/Lastfm.types';
import { YoutubeResult } from '@nuclear/core/src/rest/Youtube';

const lastfm = new rest.LastFmApi(globals.lastfmApiKey, globals.lastfmApiSecret);

export const SearchActions = {
  unifiedSearchStart: createStandardAction(Search.UNIFIED_SEARCH_START)<string>(),
  unifiedSearchSuccess: createStandardAction(Search.UNIFIED_SEARCH_SUCCESS)(),
  unifiedSearchError: createStandardAction(Search.UNIFIED_SEARCH_ERROR)(),
  youtubePlaylistSearchStart: createStandardAction(Search.YOUTUBE_PLAYLIST_SEARCH_START)<string>(),
  youtubePlaylistSearchSuccess: createStandardAction(Search.YOUTUBE_PLAYLIST_SEARCH_SUCCESS).map((id: string, info: YoutubeResult[]) => {
    return {
      payload: {
        id,
        info
      }
    };
  }),
  youtubeLiveStreamSearchStart: createStandardAction(Search.YOUTUBE_LIVESTREAM_SEARCH_START)<string>(),
  youtubeLiveStreamSearchSuccess: createStandardAction(Search.YOUTUBE_LIVESTREAM_SEARCH_SUCCESS).map((id: string, info: YoutubeResult[]) => {
    return {
      payload: {
        id,
        info
      }
    };
  }),
  youtubeLiveStreamSearchError: createStandardAction(Search.YOUTUBE_LIVESTREAM_SEARCH_ERROR).map((terms: string, error: string) => {
    return {
      payload: {
        terms,
        error
      }
    };
  }),
  albumSearchSuccess: createStandardAction(Search.ALBUM_SEARCH_SUCCESS)<SearchResultsAlbum[]>(),
  albumInfoStart: createStandardAction(Search.ALBUM_INFO_SEARCH_START).map((albumId: string) => {
    return {
      payload: {
        albumId
      }
    };
  }),
  albumInfoSuccess: createStandardAction(Search.ALBUM_INFO_SEARCH_SUCCESS).map((albumId: string, info: AlbumDetails) => {
    return {
      payload: {
        albumId,
        info
      }
    };
  }),
  albumInfoError: createStandardAction(Search.ALBUM_INFO_SEARCH_ERROR).map((albumId: string, error: string) => {
    return {
      payload: {
        albumId,
        error
      }
    };
  }),
  podcastSearchSuccess: createStandardAction(Search.PODCAST_SEARCH_SUCCESS)<SearchResultsPodcast[]>(),
  setSearchDropdownVisibility: createStandardAction(Search.SEARCH_DROPDOWN_DISPLAY_CHANGE)<boolean>(),
  updateSearchHistory: createStandardAction(Search.UPDATE_SEARCH_HISTORY)<string[]>(),
  lastFmTrackSearchStart: createStandardAction(Search.LASTFM_TRACK_SEARCH_START)<string>(),
  lastFmTrackSearchSuccess: createStandardAction(Search.LASTFM_TRACK_SEARCH_SUCCESS).map((terms: string, searchResults: LastfmTrackMatchInternal[]) => {
    return {
      payload: {
        id: terms,
        info: searchResults
      }
    };
  }),
  trackSearchSuccess: createStandardAction(Search.TRACK_SEARCH_SUCCESS)<SearchResultsAlbum[]>(),
  artistSearchSuccess: createStandardAction(Search.ARTIST_SEARCH_SUCCESS)<SearchResultsArtist[]>(),
  artistInfoStart: createStandardAction(Search.ARTIST_INFO_SEARCH_START)<string>(),
  artistInfoSuccess: createStandardAction(Search.ARTIST_INFO_SEARCH_SUCCESS).map((artistId: string, info: ArtistDetails) => {
    return {
      payload: {
        artistId,
        info
      }
    };
  }),
  artistInfoError: createStandardAction(Search.ARTIST_INFO_SEARCH_ERROR).map((artistId: string, error: unknown) => {
    return {
      payload: {
        artistId,
        error
      }
    };
  }),
  artistReleasesStart: createStandardAction(Search.ARTIST_RELEASES_SEARCH_START).map((artistId: string) => {
    return {
      payload: {
        artistId
      }
    };
  }),
  artistReleasesSuccess: createStandardAction(Search.ARTIST_RELEASES_SEARCH_SUCCESS).map((artistId: string, releases: SearchResultsAlbum[]) => {
    return {
      payload: {
        artistId,
        releases
      }
    };
  }), 
  artistReleasesError: createStandardAction(Search.ARTIST_RELEASES_SEARCH_ERROR).map((artistId: string, error: unknown) => {
    return {
      payload: {
        artistId,
        error
      }
    };
  })
};


const getSelectedMetaProvider = (getState: () => RootState, wantedProvider: SearchResultsSource = null) => {
  const {
    plugin: {
      plugins: { metaProviders }, selected }
  } = getState();

  return wantedProvider ?
    _.find(metaProviders, { searchName: wantedProvider }) :
    _.find(metaProviders, { sourceName: selected.metaProviders });
};

export const artistSearch = (terms: string) => async (dispatch, getState: () => RootState) => {
  const selectedProvider = getSelectedMetaProvider(getState);
  const results = await selectedProvider.searchForArtists(terms);
  dispatch(SearchActions.artistSearchSuccess(results));
};

export const albumSearch = (terms: string) => async (dispatch, getState: () => RootState) => {
  const selectedProvider = getSelectedMetaProvider(getState);
  const results = await selectedProvider.searchForReleases(terms);
  dispatch(SearchActions.albumSearchSuccess(results));
};

export const trackSearch = (terms: string) => async (dispatch, getState: () => RootState) => {
  const selectedProvider = getSelectedMetaProvider(getState);
  const results = await selectedProvider.searchForTracks(terms);
  dispatch(SearchActions.trackSearchSuccess(results));
};

export const podcastSearch = (terms: string) => async (dispatch, getState: () => RootState) => {
  const selectedProvider = getSelectedMetaProvider(getState);
  const results = await selectedProvider.searchForPodcast(terms);
  dispatch(SearchActions.podcastSearchSuccess(results));
};


const isAcceptableLastFMThumbnail = (thumbnail: string) =>
  !(/https?:\/\/lastfm-img\d.akamaized.net\/i\/u\/\d+s\/2a96cbd8b46e442fc41c2b86b821562f\.png/.test(thumbnail));

const getTrackThumbnail = (track: LastfmTrackMatch) => {
  const image =
    _.get(
      track,
      ['image', 1, '#text'],
      _.get(
        track,
        ['image', 0, '#text'],
        artPlaceholder
      )
    );
  
  return !isString(image) ? artPlaceholder : isAcceptableLastFMThumbnail(image) ? image : artPlaceholder;
};

export const mapLastFMTrackToInternal = (track: LastfmTrackMatch) => ({
  ...track,
  thumbnail: getTrackThumbnail(track)
});

export function lastFmTrackSearch(terms: string) {
  return dispatch => {
    dispatch(SearchActions.lastFmTrackSearchStart(terms));
    Promise.all([lastfm.searchTracks(terms)])
      .then(results => Promise.all(results.map(info => info.json())))
      .then(results => {
        dispatch(
          SearchActions.lastFmTrackSearchSuccess(terms, _.get(results[0], 'results.trackmatches.track', []).map(mapLastFMTrackToInternal))
        );
      })
      .catch(error => {
        logger.error(error);
      });
  };
}

export function youtubePlaylistSearch(terms: string) {
  return dispatch => {
    dispatch(SearchActions.youtubePlaylistSearchStart(terms));
    rest.Youtube.urlSearch(terms)
      .then(results => {
        dispatch(
          SearchActions.youtubePlaylistSearchSuccess(terms, results)
        );
      })
      .catch(error => {
        logger.error(error);
      });
  };
}

export const youtubeLiveStreamSearch = (terms: string) => async (dispatch) => {
  dispatch(SearchActions.youtubeLiveStreamSearchStart(terms));
  try {
    const results = await rest.Youtube.liveStreamSearch(terms);
    dispatch(SearchActions.youtubeLiveStreamSearchSuccess(terms, results));
  } catch (e) {
    logger.error(e);
    dispatch(SearchActions.youtubeLiveStreamSearchError(terms, e));
  }
};

export function unifiedSearch(terms: string, history: History) {
  return dispatch => {
    dispatch(SearchActions.unifiedSearchStart(terms));

    Promise.all([
      dispatch(albumSearch(terms)),
      dispatch(artistSearch(terms)),
      dispatch(podcastSearch(terms)),
      dispatch(lastFmTrackSearch(terms)),
      dispatch(youtubePlaylistSearch(terms)),
      dispatch(youtubeLiveStreamSearch(terms))
    ])
      .then(() => {
        dispatch(SearchActions.unifiedSearchSuccess());
        if (history.location.pathname !== '/search') {
          history.push('/search');
        }
      })
      .catch(error => {
        logger.error(error);
        dispatch(SearchActions.unifiedSearchError());
      });
  };
}

export const albumInfoSearch = (albumId: string, releaseType: 'master' | 'release' = 'master', release: SearchResultsAlbum) => async (dispatch, getState:() => RootState) => {
  dispatch(SearchActions.albumInfoStart(albumId));
  try {
    const selectedProvider = getSelectedMetaProvider(getState);
    const albumDetails = await selectedProvider.fetchAlbumDetails(albumId, releaseType, release?.resourceUrl);
    dispatch(SearchActions.albumInfoSuccess(albumId, albumDetails));
  } catch (e) {
    logger.error(e);
    dispatch(SearchActions.albumInfoError(albumId, e));
  }
};


export const artistInfoSearch = (artistId: string, artist: SearchResultsArtist) => async (dispatch, getState: () => RootState) => {
  dispatch(SearchActions.artistInfoStart(artistId));
  try {
    const selectedProvider = getSelectedMetaProvider(getState, artist?.source);
    const artistDetails = await selectedProvider.fetchArtistDetails(artistId);
    dispatch(SearchActions.artistInfoSuccess(artistId, artistDetails));
  } catch (e) {
    logger.error(e);
    dispatch(SearchActions.artistInfoError(artistId, e));
  }
};

export const artistReleasesSearch = (artistId: string, metaProvider: SearchResultsSource = null) => async (dispatch, getState: () => RootState) => {
  dispatch(SearchActions.artistReleasesStart(artistId));
  try {
    const selectedProvider = getSelectedMetaProvider(getState, metaProvider);
    const artistAlbums = await selectedProvider.fetchArtistAlbums(artistId);
    dispatch(SearchActions.artistReleasesSuccess(artistId, artistAlbums));
  } catch (e) {
    logger.error(e);
    dispatch(SearchActions.artistReleasesError(artistId, e));
  }
};

export const artistInfoSearchByName = (artistName: string, history: History) => async (dispatch, getState: () => RootState) => {
  const selectedProvider = getSelectedMetaProvider(getState);
  const { settings } = getState();
  try {
    history.push('/artist/loading');
    dispatch(SearchActions.artistInfoStart('loading'));
    const artistDetails = await selectedProvider.fetchArtistDetailsByName(artistName);
    dispatch(SearchActions.artistInfoSuccess(artistDetails.id, artistDetails));
    history.replace(`/artist/${artistDetails.id}`);
  } catch (e) {
    logger.error(e);
    dispatch(error(
      `Failed to find artist ${artistName}`,
      `Using ${selectedProvider.sourceName}`,
      null, settings
    ));
  }
};

export const albumInfoSearchByName = (albumName: string, artistName: string, history: History) => async (dispatch, getState: () => RootState) => {
  const selectedProvider = getSelectedMetaProvider(getState);
  const { settings } = getState();
  try {
    const albumDetails = await selectedProvider.fetchAlbumDetailsByName(albumName, 'master', artistName);
    dispatch(SearchActions.albumInfoSuccess(albumDetails.id, albumDetails));
    _.invoke(history, 'push', `/album/${albumDetails.id}`);
  } catch (e) {
    logger.error(e);
    dispatch(error(
      `Failed to find album ${albumName}`,
      `Using ${selectedProvider.sourceName}`,
      null, settings
    ));
  }
};
