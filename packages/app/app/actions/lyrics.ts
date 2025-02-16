import { logger } from '@nuclear/core';
import _ from 'lodash';

import { createStandardAction } from 'typesafe-actions';
import { Track } from '@nuclear/ui/lib/types';
import { Lyrics } from './actionTypes';

export const lyricsSearchStart = createStandardAction(Lyrics.LYRICS_SEARCH_START)<boolean>();

export const lyricsSearchSuccess = createStandardAction(Lyrics.LYRICS_SEARCH_SUCCESS).map((lyrics: string) => {
  return {
    payload: lyrics
  };
});

export const lyricsResetScroll = createStandardAction(Lyrics.LYRICS_RESET_SCROLL)();

export function lyricsSearch(track: Track) {
  return (dispatch, getState) => {
    dispatch(lyricsResetScroll());
    dispatch(lyricsSearchStart(true));
    const providers = getState().plugin.plugins.lyricsProviders;
    const selectedProvider = getState().plugin.selected.lyricsProviders;
    const lyricsProvider = _.find(providers, {sourceName: selectedProvider});

    lyricsProvider.search(track.artist, track.name)
      .then(result => {
        dispatch(lyricsSearchSuccess(result));
      })
      .catch(error => {
        logger.error(error);
      });
  };
}
