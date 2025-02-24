import React from 'react';
import userEvent from '@testing-library/user-event';
import TrackPopupContainer from './index';
import { buildStoreState } from '../../../test/storeBuilders';
import { AnyProps, mountComponent, setupI18Next } from '../../../test/testUtils';
import { RenderResult } from '@testing-library/react';

const TRACK_TITLE = 'Track title';
const TEST_IDS = {
  TRIGGER_BUTTON: 'trigger-button',
  ADD_TO_QUEUE_BUTTON: 'track-popup-add-queue',
  PLAY_NEXT_BUTTON: 'track-popup-play-next',
  PLAY_NOW_BUTTON: 'track-popup-play-now',
  ADD_TO_FAVORITES_BUTTON: 'track-popup-add-favorites',
  ADD_TO_PLAYLIST_BUTTON: 'track-popup-add-playlist',
  CREATE_PLAYIST_BUTTON: 'track-popup-create-playlist',
  DOWNLOAD_BUTTON: 'track-popup-download',
  CREATE_PLAYLIST_DIALOG_INPUT: 'track-popup-create-playlist-dialog-input',
  CREATE_PLAYLIST_DIALOG_ACCEPT: 'track-popup-create-playlist-dialog-accept',
  CREATE_PLAYLIST_DIALOG_CANCEL: 'track-popup-create-playlist-dialog-cancel'
};

const openTrackPopup = (component: RenderResult) => {
  userEvent.click(component.getByTestId(TEST_IDS.TRIGGER_BUTTON));
};

const openCreatePlaylistInputDialog = (component: RenderResult) => {
  userEvent.click(component.getByTestId(TEST_IDS.ADD_TO_PLAYLIST_BUTTON));
  const createPlaylistComponent = component.getByTestId(TEST_IDS.CREATE_PLAYIST_BUTTON);
  expect(createPlaylistComponent).toBeVisible();
  userEvent.click(createPlaylistComponent);
  expect(component.getByTestId(TEST_IDS.CREATE_PLAYLIST_DIALOG_INPUT)).toBeVisible();
};

describe('Track Popup container', () => {
  beforeAll(() => {
    setupI18Next();
  });

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should render the Track Popup container', () => {
    const { component } = mountTrackPopupContainer();
    openTrackPopup(component);
    expect(component.getByText(TRACK_TITLE)).toBeVisible();
    const popupButtonIds = [
      TEST_IDS.ADD_TO_QUEUE_BUTTON,
      TEST_IDS.PLAY_NEXT_BUTTON,
      TEST_IDS.PLAY_NOW_BUTTON,
      TEST_IDS.ADD_TO_FAVORITES_BUTTON,
      TEST_IDS.ADD_TO_PLAYLIST_BUTTON,
      TEST_IDS.DOWNLOAD_BUTTON
    ];
    popupButtonIds.forEach((id) => {
      expect(component.getByTestId(id)).toBeVisible();
    });
    expect(document.body).toMatchSnapshot(); // we need to use document.body because the popup is rendered outside the component
  });

  describe('creating new playlist', () => {
    it('should open Input Dialog', () => {
      const { component } = mountTrackPopupContainer();
      openTrackPopup(component);
      openCreatePlaylistInputDialog(component);
      expect(document.body).toMatchSnapshot();
    });

    it('should create new playlist with selected track', () => {
      const { component, store } = mountTrackPopupContainer();
      openTrackPopup(component);
      openCreatePlaylistInputDialog(component);
      const input = component.getByTestId(TEST_IDS.CREATE_PLAYLIST_DIALOG_INPUT).firstElementChild;
      expect(input).toHaveValue(TRACK_TITLE);
      const playlistName = 'New playlist name';
      userEvent.clear(input);
      userEvent.type(input, playlistName);
      expect(input).toHaveValue(playlistName);
      userEvent.click(component.getByTestId(TEST_IDS.CREATE_PLAYLIST_DIALOG_ACCEPT));

      const state = store.getState();      
      expect(state.playlists.localPlaylists.data).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: playlistName,
            tracks: [expect.objectContaining({ name: TRACK_TITLE })]
          })]));
    });

    it('should not create playlist with an empty name', async () => {
      const { component, store } = mountTrackPopupContainer();
      openTrackPopup(component);
      openCreatePlaylistInputDialog(component);
      const input = component.getByTestId(TEST_IDS.CREATE_PLAYLIST_DIALOG_INPUT).firstElementChild;
      userEvent.clear(input);
      expect(input).toHaveValue('');
      userEvent.click(component.getByTestId(TEST_IDS.CREATE_PLAYLIST_DIALOG_ACCEPT));

      const state = store.getState();
      expect(state.playlists.localPlaylists.data).not.toEqual([
        expect.objectContaining({
          name: ''
        })
      ]);
    });

    it('should add the song to next of current song when clicking PlayNext', async () => {
      const { component, store } = mountTrackPopupContainer({
        queue: {
          currentTrack: 1,
          queueItems: [{
            artist: 'test artist 1',
            name: 'test track 1',
            streams: [{
              duration: 300,
              title: 'test track 1',
              skipSegments: []
            }]
          }, {
            artist: 'test artist 2',
            name: 'test track 2',
            streams: [{
              duration: 300,
              title: 'test track 2',
              skipSegments: []
            }]
          }]
        },
        player: {
          seek: 10
        }
      });
      
      openTrackPopup(component);
      userEvent.click(component.getByTestId(TEST_IDS.PLAY_NEXT_BUTTON));

      const state = store.getState();
      expect(state.player.seek).toBe(10);
      expect(state.queue.currentTrack).toBe(1); 
      expect(state.queue.queueItems[state.queue.currentTrack + 1]).toMatchObject({
        artist: 'Artist',
        name: TRACK_TITLE
      });
    });

  });


  const mountTrackPopupContainer = (initialStore?: AnyProps) => {
    return mountComponent(
      <TrackPopupContainer  
        title={TRACK_TITLE}
        track={{
          artist: {
            name: 'Artist'
          },
          title: TRACK_TITLE
        }}
        trigger={<button data-testid={TEST_IDS.TRIGGER_BUTTON}>Trigger</button>}
      />,
      ['/'],
      initialStore,
      buildStoreState()
        .build()
    );
  };
});
