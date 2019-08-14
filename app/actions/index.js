import logger from 'electron-timber';
import core from 'nuclear-core';
import _ from 'lodash';
import artPlaceholder from '../../resources/media/art_placeholder.png';
import globals from '../globals';

const discogs = require('../rest/Discogs');
const youtube = require('../rest/Youtube');

const lastfm = new core.LastFmApi(globals.lastfmApiKey, globals.lastfmApiSecret);

export const UNIFIED_SEARCH_START = 'UNIFIED_SEARCH_START';
export const UNIFIED_SEARCH_SUCCESS = 'UNIFIED_SEARCH_SUCCESS';
export const UNIFIED_SEARCH_ERROR = 'UNIFIED_SEARCH_ERROR';

export const ARTIST_SEARCH_SUCCESS = 'ARTIST_SEARCH_SUCCESS';
export const ALBUM_SEARCH_SUCCESS = 'ALBUM_SEARCH_SUCCESS';

export const ALBUM_INFO_SEARCH_START = 'ALBUM_INFO_SEARCH_START';
export const ALBUM_INFO_SEARCH_SUCCESS = 'ALBUM_INFO_SEARCH_SUCCESS';

export const ARTIST_INFO_SEARCH_START = 'ARTIST_INFO_SEARCH_START';
export const ARTIST_INFO_SEARCH_SUCCESS = 'ARTIST_INFO_SEARCH_SUCCESS';

export const ARTIST_RELEASES_SEARCH_START = 'ARTIST_RELEASES_SEARCH_START';
export const ARTIST_RELEASES_SEARCH_SUCCESS = 'ARTIST_RELEASES_SEARCH_SUCCESS';

export const LASTFM_ARTIST_INFO_SEARCH_START =
  'LASTFM_ARTIST_INFO_SEARCH_START';
export const LASTFM_ARTIST_INFO_SEARCH_SUCCESS =
  'LASTFM_ARTIST_INFO_SEARCH_SUCCESS';

export const LASTFM_TRACK_SEARCH_START = 'LASTFM_TRACK_SEARCH_START';
export const LASTFM_TRACK_SEARCH_SUCCESS = 'LASTFM_TRACK_SEARCH_SUCCESS';

export const YOUTUBE_PLAYLIST_SEARCH_START = 'YOUTUBE_PLAYLIST_SEARCH_START';
export const YOUTUBE_PLAYLIST_SEARCH_SUCCESS = 'YOUTUBE_PLAYLIST_SEARCH_SUCCESS';

export function sourcesSearch (terms, plugins) {
  let searchResults = {};
  for (let i = 0; i < plugins.musicSources.length; i++) {
    Object.assign(searchResults, plugins.musicSources[i].search(terms));
  }
  return {};
}

export function unifiedSearchStart () {
  return {
    type: UNIFIED_SEARCH_START,
    payload: true
  };
}

export function unifiedSearchSuccess () {
  return {
    type: UNIFIED_SEARCH_SUCCESS,
    payload: false
  };
}

export function unifiedSearchError () {
  return {
    type: UNIFIED_SEARCH_ERROR
  };
}

function discogsSearch (terms, searchType, dispatchType) {
  return dispatch => {
    return discogs.search(terms, searchType)
      .then(searchResults => searchResults.json())
      .then(searchResultsJson => {
        dispatch({
          type: dispatchType,

          payload: searchResultsJson.results
        });
      })
      .catch(error => {
        logger.error(error);
      });
  };
}

export function albumSearch (terms) {
  return discogsSearch(terms, 'master', 'ALBUM_SEARCH_SUCCESS');
}

export function artistSearch (terms) {
  return discogsSearch(terms, 'artist', 'ARTIST_SEARCH_SUCCESS');
}

export function lastFmTrackSearchStart (terms) {
  return {
    type: LASTFM_TRACK_SEARCH_START,
    payload: terms
  };
}

export function lastFmTrackSearchSuccess (terms, searchResults) {
  return {
    type: LASTFM_TRACK_SEARCH_SUCCESS,
    payload: {
      id: terms,
      info: searchResults
    }
  };
}

const isAcceptableLastFMThumbnail = thumbnail =>
  !(/https?:\/\/lastfm-img\d.akamaized.net\/i\/u\/\d+s\/2a96cbd8b46e442fc41c2b86b821562f\.png/.test(thumbnail));
  
const getTrackThumbnail = track => {
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
  return isAcceptableLastFMThumbnail(image) ? image : artPlaceholder; 
};

const mapLastFMTrackToInternal = track => ({
  ...track,
  thumbnail: getTrackThumbnail(track)
});

export function lastFmTrackSearch (terms) {
  return dispatch => {
    dispatch(lastFmTrackSearchStart(terms));
    Promise.all([lastfm.searchTracks(terms)])
      .then(results => Promise.all(results.map(info => info.json())))
      .then(results => {
        dispatch(
          lastFmTrackSearchSuccess(terms, _.get(results[0], 'results.trackmatches.track', []).map(mapLastFMTrackToInternal))
        );
      })
      .catch(error => {
        logger.error(error);
      });
  };
}

export function youtubePlaylistSearchStart (terms) {
  return {
    type: YOUTUBE_PLAYLIST_SEARCH_START,
    payload: terms
  };
}

export function youtubePlaylistSearchSuccess (terms, results) {
  return {
    type: YOUTUBE_PLAYLIST_SEARCH_SUCCESS,
    payload: {
      id: terms,
      info: results
    }
  };
}

export function youtubePlaylistSearch (terms) {
  return dispatch => {
    dispatch(youtubePlaylistSearchStart(terms));
    youtube.urlSearch(terms)
      .then(results => {
        dispatch(
          youtubePlaylistSearchSuccess(terms, results)
        );
      })
      .catch(error => {
        logger.error(error);
      });
  };
}

export function unifiedSearch (terms, history) {
  return dispatch => {
    dispatch(unifiedSearchStart());

    Promise.all([
      dispatch(albumSearch(terms)),
      dispatch(artistSearch(terms)),
      dispatch(lastFmTrackSearch(terms)),
      dispatch(youtubePlaylistSearch(terms))
    ])
      .then(() => {
        dispatch(unifiedSearchSuccess());
        if (history.location.pathname !== '/search') {
          history.push('/search');
        }
      })
      .catch(error => {
        logger.error(error);
        dispatch(unifiedSearchError());
      });
  };
}

export function albumInfoStart (albumId) {
  return {
    type: ALBUM_INFO_SEARCH_START,
    payload: albumId
  };
}

export function albumInfoSuccess (albumId, info) {
  return {
    type: ALBUM_INFO_SEARCH_SUCCESS,
    payload: {
      id: albumId,
      info
    }
  };
}

export function albumInfoSearch (albumId, releaseType='master') {
  return dispatch => {
    dispatch(albumInfoStart(albumId));
    discogs
      .releaseInfo(albumId, releaseType)
      .then(info => {
        if (info.ok) {
          return info.json();
        } else {
          throw `Error fetching album data from Discogs for id ${albumId}`;
        }
      })
      .then(albumInfo => {
        dispatch(albumInfoSuccess(albumId, albumInfo));
      })
      .catch(error => {
        logger.error(error);
      });
  };
}

export function artistInfoStart (artistId) {
  return {
    type: ARTIST_INFO_SEARCH_START,
    payload: artistId
  };
}

export function artistInfoSuccess (artistId, info) {
  return {
    type: ARTIST_INFO_SEARCH_SUCCESS,
    payload: {
      id: artistId,
      info
    }
  };
}

export function artistInfoSearch (artistId) {
  return dispatch => {
    dispatch(artistInfoStart(artistId));
    discogs
      .artistInfo(artistId)
      .then(info => info.json())
      .then(artistInfo => {
        dispatch(artistInfoSuccess(artistId, artistInfo));
        dispatch(lastFmArtistInfoSearch(artistInfo.name, artistId));
      })
      .catch(error => {
        logger.error(error);
      });
  };
}

export function artistReleasesStart (artistId) {
  return {
    type: ARTIST_RELEASES_SEARCH_START,
    payload: artistId
  };
}

export function artistReleasesSuccess (artistId, releases) {
  return {
    type: ARTIST_RELEASES_SEARCH_SUCCESS,
    payload: {
      id: artistId,
      releases
    }
  };
}

export function artistReleasesSearch (artistId) {
  return dispatch => {
    dispatch(artistReleasesStart(artistId));
    discogs
      .artistReleases(artistId)
      .then(releases => releases.json())
      .then(releases => {
        dispatch(artistReleasesSuccess(artistId, releases));
      })
      .catch(error => {
        logger.error(error);
      });
  };
}

export function artistInfoSearchByName (artistName, history) {
  return dispatch => {
    discogs
      .search(artistName, 'artists')
      .then(searchResults => searchResults.json())
      .then(searchResultsJson => {
        let artist = searchResultsJson.results[0];
        if (history) {
          history.push('/artist/' + artist.id);
        }

        dispatch(artistInfoSearch(artist.id));
      })
      .catch(error => {
        logger.error(error);
      });
  };
}

export function albumInfoSearchByName (albumName, history) {
  return dispatch => {
    discogs
      .search(albumName, 'albums')
      .then(searchResults => searchResults.json())
      .then(searchResultsJson => {
        let album = searchResultsJson.results[0];
        if (album.type === 'artist') {
          dispatch(lastFmArtistInfoSearch(album.title, album.id));
          if (history) {
            history.push('/artist/' + album.id);
          }
        } else {
          dispatch(albumInfoSearch(album.id, album.type));
          if (history) {
            history.push('/album/' + album.id);
          }
        }

      })
      .catch(error => {
        logger.error(error);
      });
  };
}

export function lastFmArtistInfoStart (artistId) {
  return {
    type: LASTFM_ARTIST_INFO_SEARCH_START,
    payload: artistId
  };
}

export function lastFmArtistInfoSuccess (artistId, info) {
  return {
    type: LASTFM_ARTIST_INFO_SEARCH_SUCCESS,
    payload: {
      id: artistId,
      info
    }
  };
}

export function lastFmArtistInfoSearch (artist, artistId) {
  return dispatch => {
    dispatch(lastFmArtistInfoStart(artistId));
    Promise.all([
      lastfm.getArtistInfo(artist),
      lastfm.getArtistTopTracks(artist)
    ])
      .then(results => Promise.all(results.map(info => info.json())))
      .then(results => {
        let info = {};
        results.forEach(result => {
          info = Object.assign(info, result);
        });
        
        const mappedInfo = {
          ...info, 
          artist: {
            ...info.artist,
            similar: {
              artist: info.artist.similar.artist.map(mapLastFMTrackToInternal)
            }
          },
          toptracks: {
            ...info.toptracks, 
            track: info.toptracks.track.map(mapLastFMTrackToInternal)
          }
        };
        console.info('mapped', mappedInfo);
        dispatch(lastFmArtistInfoSuccess(artistId, mappedInfo));
      })
      .catch(error => {
        logger.error(error);
      });
  };
}
