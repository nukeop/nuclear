import { act } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { useQueueStore } from '../../stores/queueStore';
import { useSettingsStore } from '../../stores/settingsStore';
import { useSoundStore } from '../../stores/soundStore';
import { ConnectedPlayerBarWrapper as Wrapper } from './ConnectedPlayerBar.test-wrapper';

beforeEach(() => {
  useQueueStore.setState({
    items: [],
    currentIndex: 0,
    shuffleEnabled: false,
    repeatMode: 'off',
  });
  useSettingsStore.setState({
    definitions: {},
    values: {},
    loaded: true,
  });
  useSoundStore.setState({
    status: 'stopped',
    seek: 0,
    duration: 0,
  });
});

describe('ConnectedNowPlaying', () => {
  it('shows track title, artist, and thumbnail when a track is playing', () => {
    const item = new Wrapper.QueueItemBuilder()
      .withTitle('Paranoid Android')
      .withArtwork('https://example.com/art.jpg')
      .withArtist('Radiohead')
      .build();
    Wrapper.seedQueueItem(item);
    Wrapper.mount();

    expect(Wrapper.nowPlaying.title('Paranoid Android')).toBeInTheDocument();
    expect(Wrapper.nowPlaying.artist('Radiohead')).toBeInTheDocument();
    expect(Wrapper.nowPlaying.thumbnail).toBeInTheDocument();
    expect(Wrapper.nowPlaying.thumbnail).toHaveAttribute(
      'src',
      'https://example.com/art.jpg',
    );
  });

  it('shows placeholder when no track is playing', () => {
    Wrapper.mount();

    expect(Wrapper.nowPlaying.placeholder).toBeInTheDocument();
    expect(Wrapper.nowPlaying.thumbnail).not.toBeInTheDocument();
  });

  it('shows placeholder when track has no artwork', () => {
    const item = new Wrapper.QueueItemBuilder().build();
    Wrapper.seedQueueItem(item);
    Wrapper.mount();

    expect(Wrapper.nowPlaying.placeholder).toBeInTheDocument();
    expect(Wrapper.nowPlaying.thumbnail).not.toBeInTheDocument();
  });
});

describe('ConnectedControls', () => {
  it('clicking shuffle toggles shuffleEnabled in the queue store', async () => {
    Wrapper.seedShuffle(false);
    Wrapper.mount();

    await Wrapper.controls.shuffleButton.click();
    expect(useQueueStore.getState().shuffleEnabled).toBe(true);

    await Wrapper.controls.shuffleButton.click();
    expect(useQueueStore.getState().shuffleEnabled).toBe(false);
  });

  it('clicking repeat cycles through modes: off -> all -> one -> off', async () => {
    Wrapper.seedRepeatMode('off');
    Wrapper.mount();

    await Wrapper.controls.repeatButton.click();
    expect(useQueueStore.getState().repeatMode).toBe('all');

    await Wrapper.controls.repeatButton.click();
    expect(useQueueStore.getState().repeatMode).toBe('one');

    await Wrapper.controls.repeatButton.click();
    expect(useQueueStore.getState().repeatMode).toBe('off');
  });
});

describe('ConnectedVolume', () => {
  it('volume slider reflects the current volume from settings store', () => {
    Wrapper.seedVolume(0.6);
    Wrapper.mount();

    expect(Wrapper.volume.rangeInput).toHaveValue('60');
  });

  it('slider updates when the store volume changes after mount', () => {
    Wrapper.seedVolume(0.5);
    Wrapper.mount();

    expect(Wrapper.volume.rangeInput).toHaveValue('50');

    act(() => {
      useSettingsStore.setState({
        values: { 'core.playback.volume': 0.8 },
      });
    });

    expect(Wrapper.volume.rangeInput).toHaveValue('80');
  });

  it('changing the volume slider updates the settings store value', async () => {
    Wrapper.seedVolume(0.5);
    Wrapper.mount();

    await Wrapper.volume.changeValue(75);

    const storedVolume = useSettingsStore.getState().values[
      'core.playback.volume'
    ] as number;
    expect(storedVolume).toBe(0.75);
  });
});
