import { ReactNode, ScriptHTMLAttributes } from 'react';

export type AudioSource = {
  url: string;
  protocol: 'file' | 'http' | 'https' | 'hls';
};

export type SoundStatus = 'playing' | 'paused' | 'stopped';
export type SoundProps = {
  src: AudioSource;
  status: SoundStatus;
  seek?: number;
  preload?: HTMLAudioElement['preload'];
  crossOrigin?: ScriptHTMLAttributes<HTMLAudioElement>['crossOrigin'];
  onTimeUpdate?: (args: { position: number; duration: number }) => void;
  onEnd?: () => void;
  onLoadStart?: () => void;
  onCanPlay?: () => void;
  onError?: (error: Error) => void;
  children?: ReactNode;
};
