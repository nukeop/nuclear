import React from 'react';
import { render } from '@testing-library/react';

import { AnyProps, setupI18Next, TestStoreProvider } from '../../../test/testUtils';
import LyricsContainer from '.';

describe('Lyrics container', () => {
  beforeAll(() => {
    setupI18Next();
  });

  it('should say nothing is playing if there are no tracks in the queue', () => {
    const component = mountComponent({
      queue: {}
    });

    expect(component.getByText('Nothing is playing.')).toBeTruthy();
    expect(component.getByText('Add some music to the queue to display the lyrics here!')).toBeTruthy();
  });

  it('should display lyrics if there is an item in the queue and the lyrics have been downloaded', () => {
    const component = mountComponent();

    expect(component.getByText('test track')).toBeTruthy();
    expect(component.getByText('by test artist')).toBeTruthy();
    expect(component.getByText('test song lyrics')).toBeTruthy();
  });

  it('should say lyrics could not be found if they are not downloaded', () => {
    const component = mountComponent({
      lyrics: {
        lyricsSearchResult: ''
      },
      queue: {
        currentTrack: 0,
        queueItems: [{}]
      }
    });

    expect(component.getByText('No lyrics were found for this song.')).toBeTruthy();
  });

  const mountComponent = (initialStore?: AnyProps) => {
    const component = render(<TestStoreProvider
      initialState={initialStore ?? {
        lyrics: {
          lyricsSearchResult: 'test song lyrics'
        },
        queue: {
          currentTrack: 0,
          queueItems: [
            {
              name: 'test track',
              artist: 'test artist'
            }
          ]
        }
      }}
    >
      <LyricsContainer />
    </TestStoreProvider>);
    return component;
  };
});
