import { act, render } from '@testing-library/react';

import { Sound } from '../Sound';
import { AudioSource } from '../types';
import {
  fireMediaCanPlay,
  fireMediaLoadStart,
  resetMediaSpies,
  setupAudioContextMock,
} from './test-utils';

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
      fireMediaCanPlay(audio);
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

  it('does not call play during a track switch until the new source is ready', () => {
    const { restore } = setupAudioContextMock();
    const sourceA: AudioSource = { url: '/a.mp3', protocol: 'http' };
    const sourceB: AudioSource = { url: '/b.mp3', protocol: 'http' };

    const { rerender } = render(<Sound src={sourceA} status="playing" />);

    const audio = document.querySelector('audio')!;
    act(() => {
      fireMediaLoadStart(audio);
      fireMediaCanPlay(audio);
    });

    rerender(<Sound src={sourceA} status="stopped" />);
    act(() => {
      fireMediaLoadStart(audio);
    });

    const { playMock } = resetMediaSpies();

    rerender(<Sound src={sourceB} status="playing" />);

    expect(playMock).not.toHaveBeenCalled();

    act(() => {
      fireMediaCanPlay(audio);
    });

    expect(playMock).toHaveBeenCalled();
    restore();
  });

  it('plays when status changes from stopped to playing and audio is already buffered', () => {
    const { restore } = setupAudioContextMock();
    const source: AudioSource = { url: '/a.mp3', protocol: 'http' };

    const { rerender } = render(<Sound src={source} status="stopped" />);

    const audio = document.querySelector('audio')!;
    act(() => {
      fireMediaCanPlay(audio);
    });

    const { playMock } = resetMediaSpies();

    rerender(<Sound src={source} status="playing" />);

    expect(playMock).toHaveBeenCalled();
    restore();
  });

  it('plays the new source when the queue auto-advances without an intermediate render', () => {
    const { restore } = setupAudioContextMock();
    const sourceA: AudioSource = { url: '/a.mp3', protocol: 'http' };
    const sourceB: AudioSource = { url: '/b.mp3', protocol: 'http' };

    const { rerender } = render(<Sound src={sourceA} status="playing" />);
    const audio = document.querySelector('audio')!;

    act(() => {
      fireMediaCanPlay(audio);
    });

    const { playMock } = resetMediaSpies();

    rerender(<Sound src={sourceB} status="playing" />);

    act(() => {
      fireMediaLoadStart(audio);
      fireMediaCanPlay(audio);
    });

    expect(playMock).toHaveBeenCalled();
    restore();
  });
});
