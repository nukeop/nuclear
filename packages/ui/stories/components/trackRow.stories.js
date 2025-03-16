import React from 'react';
import { TrackRow } from '../..';

export default {
  title: 'Components/Track row'
};

export const WithAllColumns = () => (
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
);

export const SeveralRows = () => (
  <div className='bg'>
    <table style={{width: '100%'}}>
      <tbody>
        {
          Array.from({length: 10}).map((_, i) => (
            <TrackRow
              key={i}
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
          ))
        }
      </tbody>
    </table>
  </div>
);
