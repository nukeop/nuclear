import { act, render } from '@testing-library/react';

import { CrossfadeSound } from '../CrossfadeSound';
import { AudioSource } from '../types';
import { resetMediaSpies, setupAudioContextMock } from './test-utils';

const srcA: AudioSource = { url: '/a.mp3', protocol: 'http' };
const srcB: AudioSource = { url: '/b.mp3', protocol: 'http' };

describe('CrossfadeSound', () => {
  it('calls play on next and pauses current after crossfade', async () => {
    const { restore } = setupAudioContextMock();
    const { playMock, pauseMock } = resetMediaSpies();

    vi.useFakeTimers();
    const { rerender, unmount } = render(
      <CrossfadeSound src={srcA} status="playing" crossfadeMs={25} />,
    );

    rerender(<CrossfadeSound src={srcB} status="playing" crossfadeMs={25} />);

    expect(playMock).toHaveBeenCalled();

    await act(async () => {
      await vi.runOnlyPendingTimersAsync();
    });

    expect(pauseMock).toHaveBeenCalled();

    unmount();
    restore();
    vi.useRealTimers();
  });
});
