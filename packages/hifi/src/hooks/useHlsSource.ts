import Hls from 'hls.js';
import { RefObject, useEffect, useRef } from 'react';

import { AudioSource } from '../types';

const canPlayNativeHls = (audio: HTMLAudioElement): boolean =>
  audio.canPlayType('application/vnd.apple.mpegurl') !== '';

export const useHlsSource = (
  audioRef: RefObject<HTMLAudioElement | null>,
  src: AudioSource,
  isReady: boolean,
) => {
  const hlsRef = useRef<Hls | null>(null);
  const prevUrl = useRef<string | null>(null);

  useEffect(() => {
    if (!isReady) {
      return;
    }
    const audio = audioRef.current;
    if (!audio) {
      return;
    }
    if (src.protocol !== 'hls') {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      return;
    }
    if (src.url === prevUrl.current) {
      return;
    }
    prevUrl.current = src.url;

    if (hlsRef.current) {
      // Means we have a new URL and need to destroy the old HLS instance
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    if (canPlayNativeHls(audio)) {
      // Mac & Linux path (WebKit / WebKitGTK)
      // WebKit has a known quirk where assigning a new HLS URL to an audio
      // element that already has one loaded leaves it in a half-broken state:
      // loadstart fires but canplay never does, so playback silently stalls.
      // Fully reset the element before assigning the new URL.
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
      audio.src = src.url;
      audio.load();
      return;
    }

    if (Hls.isSupported()) {
      // Windows path
      // Uses HLS.js
      const hls = new Hls();
      hls.attachMedia(audio);
      hls.loadSource(src.url);
      hlsRef.current = hls;
    }
  }, [src, isReady, audioRef]);

  useEffect(() => {
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, []);
};
