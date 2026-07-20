import Hls from 'hls.js';
import { RefObject, useEffect, useRef } from 'react';

import { AudioSource } from '../types';

const canPlayNativeHls = (audio: HTMLAudioElement): boolean =>
  audio.canPlayType('application/vnd.apple.mpegurl') !== '';

export const useHlsSource = (
  audioRef: RefObject<HTMLAudioElement | null>,
  src: AudioSource,
) => {
  const hlsRef = useRef<Hls | null>(null);
  const prevUrl = useRef<string | null>(null);

  useEffect(() => {
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

    if (Hls.isSupported()) {
      // Use hls.js wherever MSE is available (Chrome, Chromium,
      // WebView2, Firefox, etc.). Chrome 147+ returns "maybe" for the native
      // HLS canPlayType check, but its built-in HLS demuxer is broken and
      // throws DEMUXER_ERROR_COULD_NOT_PARSE, so hls.js must take priority.
      // First reported on Discord
      // Reference: https://github.com/video-dev/hls.js/issues/7827
      const hls = new Hls();
      hls.attachMedia(audio);
      hls.loadSource(src.url);
      hlsRef.current = hls;
    } else if (canPlayNativeHls(audio)) {
      // Fallback: native HLS for environments where hls.js can't run but the
      // browser handles HLS natively (Safari / iOS WebKit).
      // WebKit has a known quirk where assigning a new HLS URL to an audio
      // element that already has one loaded leaves it in a half-broken state:
      // loadstart fires but canplay never does, so playback silently stalls.
      // Fully reset the element before assigning the new URL.
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
      audio.src = src.url;
      audio.load();
    }
  }, [src, audioRef]);

  useEffect(() => {
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, []);
};
