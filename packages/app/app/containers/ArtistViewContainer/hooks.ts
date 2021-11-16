import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import _ from 'lodash';
import electron from 'electron';

import * as QueueActions from '../../actions/queue';
import * as SearchActions from '../../actions/search';
import * as FavoritesActions from '../../actions/favorites';
import { searchSelectors } from '../../selectors/search';
import { favoritesSelectors } from '../../selectors/favorites';

export const useArtistViewProps = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { artistId } = useParams<{ artistId: string }>();
  const artistDetails = useSelector(searchSelectors.artistDetails);
  const artist = artistDetails[artistId];

  const addTrackToQueue = useCallback(async (item) => {
    dispatch(QueueActions.addToQueue(item));
  }, [dispatch]);

  const artistInfoSearchByName = useCallback(async (artistName) => {
    dispatch(SearchActions.artistInfoSearchByName(artistName, history));
  }, [history, dispatch]);

  const albumInfoSearch = useCallback(async (albumId, releaseType, release) => {
    dispatch(SearchActions.albumInfoSearch(albumId, releaseType, release));
  }, [dispatch]);

  const favoriteArtists: { id: string }[] = useSelector(favoritesSelectors.artists);

  const getIsFavorite = (currentArtist, favoriteArtists) => {
    const favoriteArtist = _.find(favoriteArtists, {
      id: currentArtist?.id
    });
    return Boolean(favoriteArtist);
  };

  const isFavorite = getIsFavorite(artist, favoriteArtists);

  const addFavoriteArtist = useCallback(async () => {
    dispatch(FavoritesActions.addFavoriteArtist(artist));
  }, [artist, dispatch]);

  const removeFavoriteArtist = useCallback(async () => {
    dispatch(FavoritesActions.removeFavoriteArtist(artist));
  }, [artist, dispatch]);

  const handleArtistInfoClick = () => {
    let link = artist.releases[0].resourceUrl;
    const source = artist.releases[0].source;

    const discogs_re = /Discogs/i;
    const musicbrainz_re = /Musicbrainz/i;

    if (source.match(musicbrainz_re) !== null) {
      link = 'https://musicbrainz.org/search?query=' + artist.name + '&type=artist&method=indexed';
    } else if (source.match(discogs_re) !== null) {
      link = 'https://www.discogs.com/search/?q=' + artist.name + '&type=all';
    }

    handleExternal(link);
  };

  const handleExternal = (link: string) => {
    link && link.length && electron.shell.openExternal(link);
  };


  return {
    artist,
    isFavorite,
    addTrackToQueue,
    artistInfoSearchByName,
    albumInfoSearch,
    removeFavoriteArtist,
    addFavoriteArtist,
    handleArtistInfoClick
  };
};
