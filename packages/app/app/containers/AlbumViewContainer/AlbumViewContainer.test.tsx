import { render } from '@testing-library/react';
import React from 'react';
import AlbumViewContainer from '.';
import { AnyProps, setupI18Next, TestRouterProvider, TestStoreProvider } from '../../../test/testUtils';

describe('Album view container', () => {
  beforeAll(() => {
    setupI18Next();
  });

  it('should display an album', () => {
    const component = mountComponent();
    expect(component.asFragment()).toMatchSnapshot();
  });

  it('should show that an album is still loading', () => {

  });

  const mountComponent = (initialStore?: AnyProps) => {
    const component = render(
      <TestStoreProvider
        initialStore={initialStore || {
          search: {
            albumDetails: {
              ['test-album-id']: {
                loading: false,
                artist: 'test artist',
                title: 'test album',
                thumb: 'test thumbnail',
                coverImage: 'test cover',
                images: ['first image', 'second image'],
                genres: ['genre 1', 'genre 2'],
                year: '2001',
                type: 'master',
                tracklist: [
                  {
                    uuid: 'track-1-id',
                    ids: [],
                    artist: 'test artist',
                    title: 'test track 1',
                    duration: 120
                  },
                  {
                    uuid: 'track-2-id',
                    ids: [],
                    artist: 'test artist',
                    title: 'test track 2',
                    duration: 63
                  },
                  {
                    uuid: 'track-3-id',
                    ids: [],
                    artist: 'test artist',
                    title: 'test track 3',
                    duration: 7
                  }
                ]
              }
            }
          }
        }}
      >
        <TestRouterProvider
          initialEntries={['/album/test-album-id']}
        >
          <AlbumViewContainer />
        </TestRouterProvider>
      </TestStoreProvider>
    );
    return component;
  };
});
