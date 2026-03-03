import { act, render } from '@testing-library/react';

import { Sound } from '../Sound';
import { AudioSource } from '../types';
import { resetMediaSpies, setupAudioContextMock } from './test-utils';

const httpSource: AudioSource = { url: '/a.mp3', protocol: 'http' };

describe('Sound', () => {
  it('sets currentTime on the active audio element when seek changes', () => {
    const { restore } = setupAudioContextMock();

    const { rerender } = render(<Sound src={httpSource} status="paused" />);

    rerender(<Sound src={httpSource} status="paused" seek={42} />);

    const audios = document.querySelectorAll('audio');
    const active = audios[0] as HTMLAudioElement;
    expect(active.currentTime).toBe(42);

    restore();
  });

  it('calls play after loading a new source while status is playing', () => {
    const { restore } = setupAudioContextMock();
    const sourceA: AudioSource = { url: '/a.mp3', protocol: 'http' };
    const sourceB: AudioSource = { url: '/b.mp3', protocol: 'http' };

    const { rerender } = render(<Sound src={sourceA} status="playing" />);

    const { playMock } = resetMediaSpies();

    rerender(<Sound src={sourceB} status="playing" />);

    const audio = document.querySelector('audio')!;
    act(() => {
      audio.dispatchEvent(new Event('canplay', { bubbles: false }));
    });

    expect(playMock).toHaveBeenCalled();
    restore();
  });

  it('does not call play after loading a new source while status is paused', () => {
    const { restore } = setupAudioContextMock();
    const sourceA: AudioSource = { url: '/a.mp3', protocol: 'http' };
    const sourceB: AudioSource = { url: '/b.mp3', protocol: 'http' };

    const { rerender } = render(<Sound src={sourceA} status="paused" />);

    const { playMock } = resetMediaSpies();

    rerender(<Sound src={sourceB} status="paused" />);

    expect(playMock).not.toHaveBeenCalled();
    restore();
  });
});
