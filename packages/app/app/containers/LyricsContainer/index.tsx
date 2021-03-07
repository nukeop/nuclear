import React from 'react';
import _ from 'lodash';
import { useSelector } from 'react-redux';

import LyricsView from '../../components/LyricsView';
import { lyricsSelectors } from '../../selectors/lyrics';
import { queue as queueSelector } from '../../selectors/queue';

const LyricsContainer = () => {
  const lyricsSearchResults = useSelector(lyricsSelectors.lyricsSearchResults);
  const queue = useSelector(queueSelector);

  return <LyricsView
    track={_.get(
      queue.queueItems,
      queue.currentSong
    )}
    lyricsSearchResults={lyricsSearchResults as { type: string }}
  />;
};

export default LyricsContainer;
