import React from 'react';
import _ from 'lodash';
import { useSelector } from 'react-redux';

import LyricsView from '../../components/LyricsView';
import { lyricsSelectors } from '../../selectors/lyrics';
import { queue as queueSelector } from '../../selectors/queue';

const LyricsContainer = () => {
  const lyricsSearchResult = useSelector(lyricsSelectors.lyricsSearchResult);
  const queue = useSelector(queueSelector);

  return <LyricsView
    track={_.get(
      queue.queueItems,
      queue.currentTrack
    )}
    lyricsSearchResult={lyricsSearchResult}
  />;
};

export default LyricsContainer;
