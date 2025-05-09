import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getOption } from '@nuclear/core';
import Sound from 'react-hifi';

export type PlaybackStatus = 'PAUSED' | 'PLAYING' | 'STOPPED';

export interface PlayerState {
  playbackStatus: PlaybackStatus;
  playbackStreamLoading: boolean;
  playbackProgress: number;
  seek: number;
  volume: number;
  muted: boolean;
  playbackRate: number;
}

const initialState: PlayerState = {
  playbackStatus: Sound.status.PAUSED,
  playbackStreamLoading: false,
  playbackProgress: 0,
  seek: 0,
  volume: getOption('volume') as number,
  muted: false,
  playbackRate: 2
};

export const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    startPlayback(state) {
      state.playbackStatus = Sound.status.PLAYING;
    },
    pausePlayback(state) {
      state.playbackStatus = Sound.status.PAUSED;
    },
    stopPlayback(state) {
      state.playbackStatus = Sound.status.STOPPED;
    },
    updatePlaybackProgress(state, action: PayloadAction<{ progress: number; seek: number }>) {
      state.playbackProgress = action.payload.progress;
      state.seek = action.payload.seek;
    },
    updateSeek(state, action: PayloadAction<number>) {
      state.seek = action.payload;
    },
    updateVolume(state, action: PayloadAction<number>) {
      state.volume = action.payload;
    },
    mute(state) {
      state.muted = true;
    },
    unMute(state) {
      state.muted = false;
    },
    updateStreamLoading(state, action: PayloadAction<boolean>) {
      state.playbackStreamLoading = action.payload;
    },
    updatePlaybackRate(state, action: PayloadAction<{ rate: number }>) {
      state.playbackRate = action.payload.rate;
    },
    nextTrack(state, action: PayloadAction) {
      state.playbackProgress = 0;
      state.seek = 0;
    },
    previousTrack(state, action: PayloadAction) {
      state.playbackProgress = 0;
      state.seek = 0;
    },
    selectTrack(state, action: PayloadAction) {
      state.playbackProgress = 0;
      state.seek = 0;
    }
  }
});

export const {
  startPlayback,
  pausePlayback,
  stopPlayback,
  updatePlaybackProgress,
  updateSeek,
  updateVolume,
  mute,
  unMute,
  updateStreamLoading,
  updatePlaybackRate
} = playerSlice.actions;

export default playerSlice.reducer;
