import React from 'react';
import _ from 'lodash';
import { useSelector } from 'react-redux';

import LyricsView from '../../components/LyricsView';
import { lyricsSelectors } from '../../selectors/lyrics';
import { queue as queueSelector } from '../../selectors/queue';

const LyricsContainer = () => {
  const lyricsSearchResults = useSelector(lyricsSelectors.lyricsSearchResults);
  // eslint-disable-next-line no-console
  console.log(lyricsSearchResults);
  const queue = useSelector(queueSelector);
  const track = _.get(
    queue.queueItems,
    queue.currentSong
  );
  // eslint-disable-next-line no-console
  console.log(track, queue);

  return <LyricsView
    showHeader={true}
    trackName={track?.name}
    trackArtist={track?.artist}
    lyricsSearchResults={lyricsSearchResults as { type: string }}
  />;
};

export default LyricsContainer;
