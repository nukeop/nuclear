import React from 'react';
import { storiesOf } from '@storybook/react';

import { TrackRow } from '..';

storiesOf('Track row', module)
  .add('With all columns', () => (
    <div className='bg'>
      <table style={{width: '100%'}}>
        <tbody>
          <TrackRow
            track={{
              album: 'Test album',
              artist: { name: 'Test artist' },
              name: 'Test track',
              duration: 100,
              position: 0,
              playcount: Math.random() * 100000000
            }}
            onDelete={() => alert('Track deleted')}

            displayArtist
            displayAlbum
            displayCover
            displayDuration
            displayPlayCount
            displayTrackNumber

            withAddToDownloads
            withAddToFavorites
            withAddToQueue
            withDeleteButton
            withPlayNow
          />
        </tbody>
      </table>
    </div>
  ))
  .add('Several rows', () => (
    <div className='bg'>
      <table style={{width: '100%'}}>
        <tbody>
          {
            _().range(10).map((i, idx) => (
              <TrackRow
                key={idx}
                track={{
                  album: 'Test album',
                  artist: { name: 'Test artist' },
                  name: `Test track ${i}`,
                  duration: 100,
                  position: i+1,
                  playcount: Math.random() * 100000000
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
