import React from 'react';

import { Seekbar } from '../..';

export default {
  title: 'Components/Seekbar'
};

export const Basic = () => (
  <div>
    Seekbars filled to various levels.
    <br /><br />
    60%:
    <Seekbar fill={60} />
    <br />
    70%:
    <Seekbar fill={70} />
    <br />
    80%:
    <Seekbar fill={80} />
    <br />
    30%:
    <Seekbar fill={30} />
    <br />
    10%:
    <Seekbar fill={10} />
    <br />
  </div>
);

export const Loading = () => (
  <div>
    Seekbar while loading a track.
    <br/><br/>
    <Seekbar isLoading />
  </div>
);

export const WithSkippableSegments = () => <div style={{
  display: 'flex',
  flexFlow: 'column',
  height: '100%'
}}>
  <div style={{flex: '1 1 auto'}} />
  <Seekbar
    fill={75}
    skipSegments={[{
      startTime: 10,
      endTime: 35
    }, {
      startTime: 50,
      endTime: 60
    }, {
      startTime: 70,
      endTime: 85
    }]}
    queue={{
      queueItems: [{
        streams: [{
          duration: 100
        }]
      }],
      currentTrack: 0
    }}
    segmentPopupMessage='Non-music'
  />
</div>;
