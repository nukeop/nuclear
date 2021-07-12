import React from 'react';
import { render } from '@testing-library/react';

import { AnyProps, setupI18Next, TestStoreProvider } from '../../../test/testUtils';
import MiniPlayerContainer from '.';

describe('miniplayer container', () => {
  beforeAll(() => {
    setupI18Next();
  });

  it('should say nothing is playing if there are no tracks in the queue', () => {
    const component = mountComponent({
      settings: {miniPlayer: true},
      queue: {}
    });

    expect(component.getByText('Nothing is playing.')).toBeTruthy();
    expect(component.getByText('Add some music to the queue to display the lyrics here!')).toBeTruthy();
  });

  it('should display lyrics if there is an item in the queue and the lyrics have been downloaded', () => {
    const component = mountComponent();

    expect(component.getByText('test track')).toBeTruthy();
    expect(component.getByText('test artist')).toBeTruthy();
    expect(component.getByText('test song lyrics')).toBeTruthy();
  });

  it('should say lyrics could not be found if they are not downloaded', () => {
    const component = mountComponent({
      settings: {miniPlayer: true},
      lyrics: {
        lyricsSearchResults: {}
      },
      queue: {
        currentSong: 0,
        queueItems: [
          {
            name: 'test track',
            artist: 'test artist'
          }
        ]
      }
    });
    expect(component.getByText('No lyrics were found for this song.')).toBeTruthy();
  });

  const mountComponent = (initialStore?: AnyProps) => {
    
    const component = render(
      <TestStoreProvider
        initialState={initialStore ?? {
          settings: {miniPlayer: true},
          lyrics: {
            lyricsSearchResults: {
              type: 'test song lyrics'
            }
          },
          queue: {
            currentSong: 0,
            queueItems: [
              {
                name: 'test track',
                artist: 'test artist'
              }
            ]
          }
        }}
      >)
        <MiniPlayerContainer/>
      </TestStoreProvider>);
    return component;
  };
});
