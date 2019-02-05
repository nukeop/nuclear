export const LYRIC_SEARCH_START = 'LYRIC_SEARCH_START';
export const LYRIC_SEARCH_SUCCESS = 'LYRIC_SEARCH_SUCCESS';

export function lyricSearchStart (query) {
  return {
    type: LYRIC_SEARCH_START,
    payload: query
  };
}

export function unifiedSearchSuccess (query, result) {
  return {
    type: LYRIC_SEARCH_SUCCESS,
    payload: {
      query: query,
      info: result
    }
  };
}
