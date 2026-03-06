import { RefObject, useEffect, useRef } from 'react';

import { MseController } from '../fmp4';
import { AudioSource } from '../types';

export const useMseSource = (
  audioRef: RefObject<HTMLAudioElement | null>,
  src: AudioSource,
  isReady: boolean,
) => {
  const controllerRef = useRef<MseController | null>(null);

  useEffect(() => {
    if (controllerRef.current) {
      controllerRef.current.destroy(audioRef.current);
      controllerRef.current = null;
    }

    const audio = audioRef.current;
    if (!audio || !isReady || src.protocol !== 'mse') {
      return;
    }

    const controller = new MseController();
    controllerRef.current = controller;
    controller.init(audio, src.url, src.durationSeconds!);

    const onTimeUpdate = () => controller.handleTimeUpdate(audio);
    const onSeeking = () => controller.handleSeeking(audio);

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('seeking', onSeeking);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('seeking', onSeeking);
      controller.destroy(audio);
      controllerRef.current = null;
    };
  }, [src.url, src.protocol, src.durationSeconds, isReady, audioRef]);
};
