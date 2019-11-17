import React from 'react';
import { storiesOf } from '@storybook/react';

import { TrackRow } from '..';

storiesOf('Track row', module)
  .add('Basic', () => (
    <div className='bg'>
      <table>
        <tbody>
          <TrackRow
            track={{
              album: 'Test album',
              artist: { name: 'Test artist' },
              duration: 100,
              position: 0,
              playcount: 100
            }}
            displayArtist
            displayAlbum
            displayCover
            displayDuration
            displayPlayCount
            displayTrackNumber
          />
        </tbody>
      </table>
    </div>
  ))
  .add('Several rows', () => (
    <div className='bg'>
      <table>
        <tbody>
          {
            _().range(10).map(() => (
              <TrackRow
                track={{
                  album: 'Test album',
                  artist: { name: 'Test artist' },
                  duration: 100,
                  position: 0,
                  playcount: 100
                }}
                displayArtist
                displayAlbum
                displayCover
                displayDuration
                displayPlayCount
                displayTrackNumber
              />
            )).value()
          }
        </tbody>
      </table>
    </div>
  ));
