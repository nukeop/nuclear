import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { AnyProps, configureMockStore, setupI18Next, TestStoreProvider } from '../../../test/testUtils';
import { getMouseEvent } from '../../../test/mockMouseEvent';
import PlayerBarContainer from '.';
import { buildStoreState } from '../../../test/storeBuilders';

describe('PlayerBar container', () => {
  beforeAll(() => {
    setupI18Next();
  });

  it('should display no time stamp if trackDuration is false', async () => {
    const { component } = mountComponent({
      settings: {
        trackDuration: false
      }
    });

    const timePlayed = component.queryByTestId('track-duration-played');
    expect(timePlayed).toBeNull();
  });

  it('should have an empty seekbar if the current track is still loading', () => {
    const { component } = mountComponent({
      queue: {
        queueItems: [{
          loading: true
        }]
      }
    });

    const fill = component.getByTestId('seekbar-fill');
    const timePlayed = component.queryByTestId('track-duration-played');
    const timeToEnd = component.queryByTestId('track-duration-to-end');

    expect(fill.style.width).toBe('0%');
    expect(timePlayed).toBeNull();
    expect(timeToEnd).toBeNull();
  });

  it('should show a loading play button if the current track is still loading', () => {
    const { component } = mountComponent({
      queue: {
        queueItems: [{
          loading: true
        }]
      }
    });

    const playButton = component.queryByTestId('player-controls-play');
    expect(playButton.children[0].className).toContain('circle notch');
  });

  it.each([
    ['loop', 'loopAfterQueueEnd'], 
    ['shuffle', 'shuffleQueue'],
    ['autoradio', 'autoradio'],
    ['mini-player', 'miniPlayer']
  ])('should enable %s option', async (option, setting) => {
    const { component, store } = mountComponent({
      settings: {
        loopAfterQueueEnd: false,
        shuffleQueue: false,
        autoradio: false,
        miniPlayer: false
      }
    });

    userEvent.click(component.getByTestId(`${option}-play-option`));
    const state = store.getState();
    expect(state.settings[setting]).toBe(true);
  });

  // Has to be skipped until jsdom supports setting clientWidth on the body
  xit('should seek to a particular place in the current track when the seekbar is clicked', async () => {
    const { component, store } = mountComponent();

    const seekbar = await component.findByTestId('seekbar');
    fireEvent(seekbar, getMouseEvent('click', {
      pageX: 100
    }));
    const state = store.getState();

    const documentWidth = 200;
    // set document width to the above value here

    expect(state.player.seek).toBe(100 / documentWidth);
  });
  
  it('should start playing the current track when the play button is clicked', async () => {
    const { component, store } = mountComponent();
    const playButton = await component.findByTestId('player-controls-play');
    userEvent.click(playButton);
    const state = store.getState();
    expect(state.player.playbackStatus).toBe('PLAYING');
  });

  it('should pause the current track when the pause button is clicked', async () => {
    const { component, store } = mountComponent({
      player: {
        playbackStatus: 'PLAYING'
      }
    });
    const pauseButton = await component.findByTestId('player-controls-play');
    expect(pauseButton.children[0].className).toContain('pause');

    userEvent.click(pauseButton);
    const state = store.getState();
    expect(state.player.playbackStatus).toBe('PAUSED');
  });

  it('should skip to the next track when the next button is clicked', async () => {
    const { component, store } = mountComponent();
    const nextButton = await component.findByTestId('player-controls-forward');
    userEvent.click(nextButton);
    const state = store.getState();
    expect(state.queue.currentTrack).toBe(1);
  });

  it('should rewind to the beginning of the current track when the previous button is clicked and the track has progressed past the first 3 seconds', async () => {
    const { component, store } = mountComponent({
      queue: {
        currentTrack: 0,
        queueItems: [{
          artist: 'test artist 1',
          name: 'test track 1',
          streams: [{
            duration: 300,
            title: 'test track 1',
            skipSegments: [],
            stream: 'stream URL'
          }]
        }]
      },
      player: {
        seek: 5
      }
    });
    const previousButton = await component.findByTestId('player-controls-back');
    userEvent.click(previousButton);
    const state = store.getState();
    waitFor(() => expect(state.player.seek).toBe(0));
    expect(state.queue.currentTrack).toBe(0);
  });

  it('should skip to the previous track when the previous button is clicked and the track has not progressed past the first 3 seconds', async () => {
    const { component, store } = mountComponent({
      queue: {
        currentTrack: 1,
        queueItems: [{
          artist: 'test artist 1',
          name: 'test track 1',
          streams: [{
            duration: 300,
            title: 'test track 1',
            skipSegments: [],
            stream: 'stream URL 1'
          }]
        }, {
          artist: 'test artist 2',
          name: 'test track 2',
          streams: [{
            duration: 300,
            title: 'test track 2',
            skipSegments: [],
            stream: 'stream URL 2'
          }]
        }]
      },
      player: {
        seek: 0
      }
    });
    const previousButton = await component.findByTestId('player-controls-back');
    userEvent.click(previousButton);
    const state = store.getState();
    expect(state.player.seek).toBe(0);
    expect(state.queue.currentTrack).toBe(0);
  });

  it('should skip to the previous track if there is a sponsorblock segment at the beginning of the current track and the playhead is within 3 seconds of the segment', async () => {
    const { component, store } = mountComponent({
      queue: {
        currentTrack: 1,
        queueItems: [{
          artist: 'test artist 1',
          name: 'test track 1',
          streams: [{
            duration: 300,
            title: 'test track 1',
            skipSegments: [],
            stream: 'stream URL 1'
          }]
        }, {
          artist: 'test artist 2',
          name: 'test track 2',
          streams: [{
            duration: 300,
            title: 'test track 2',
            skipSegments: [{
              category: 'sponsor',
              duration: 10,
              endTime: 10,
              startTime: 0
            }],
            stream: 'stream URL 2'
          }]
        }]
      },
      player: {
        seek: 12
      }
    });
    const previousButton = await component.findByTestId('player-controls-back');
    userEvent.click(previousButton);
    const state = store.getState();
    expect(state.player.seek).toBe(0);
    expect(state.queue.currentTrack).toBe(0); 
  });

  it('should go back to the beginning of current track if current track is the first song in the queue', async () => {
    const { component, store } = mountComponent({
      queue: {
        currentTrack: 0,
        queueItems: [{
          artist: 'test artist 1',
          name: 'test track 1',
          streams: [{
            duration: 300,
            title: 'test track 1',
            skipSegments: [],
            stream: 'stream URL'
          }]
        }]
      },
      player: {
        seek: 12
      }
    });
    const previousButton = await component.findByTestId('player-controls-back');
    userEvent.click(previousButton);
    const state = store.getState();
    expect(state.player.seek).toBe(0);
    expect(state.queue.currentTrack).toBe(0); 
  });

  const mountComponent = (initialStore?: AnyProps) => {
    const store = configureMockStore({
      ...buildStoreState()
        .withTracksInPlayQueue()
        .withSettings({
          trackDuration: true,
          skipSponsorblock: true
        })
        .build(),
      ...initialStore
    });

    const component = render(<TestStoreProvider
      store={store}
    >
      <PlayerBarContainer />
    </TestStoreProvider>);
    return { component, store };
  };
});
