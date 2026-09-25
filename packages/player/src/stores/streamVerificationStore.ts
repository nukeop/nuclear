import { LazyStore } from '@tauri-apps/plugin-store';
import omit from 'lodash-es/omit';
import { create } from 'zustand';

import type { Track } from '@nuclearplayer/model';

import { streamVerificationApi } from '../apis/streamVerificationApi';

const store = new LazyStore('stream-verifications.json');

type StreamVerificationState = {
  verifications: Record<string, string>;
  loaded: boolean;

  loadFromDisk: () => Promise<void>;
  saveVerification: (track: Track, streamId: string) => Promise<void>;
  removeVerification: (track: Track) => Promise<void>;
};

export const useStreamVerificationStore = create<StreamVerificationState>(
  (set, get) => {
    const write = async (verifications: Record<string, string>) => {
      set({ verifications });
      await store.set('verifications', verifications);
      await store.save();
    };

    return {
      verifications: {},
      loaded: false,

      loadFromDisk: async () => {
        const verifications =
          (await store.get<Record<string, string>>('verifications')) ?? {};
        set({ verifications, loaded: true });
      },

      saveVerification: (track, streamId) =>
        write({
          ...get().verifications,
          [streamVerificationApi.verificationKey(track)]: streamId,
        }),

      removeVerification: (track) =>
        write(
          omit(
            get().verifications,
            streamVerificationApi.verificationKey(track),
          ),
        ),
    };
  },
);

export const initializeStreamVerificationStore = async (): Promise<void> => {
  await useStreamVerificationStore.getState().loadFromDisk();
};
