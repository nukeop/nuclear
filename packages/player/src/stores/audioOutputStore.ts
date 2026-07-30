import { LazyStore } from '@tauri-apps/plugin-store';
import { create } from 'zustand';

import { Logger } from '../services/logger';

const AUDIO_OUTPUT_FILE = 'audio-output.json';
const store = new LazyStore(AUDIO_OUTPUT_FILE);

export type AudioDevice = {
  deviceId: string;
  groupId: string;
  label: string;
};

type AudioOutputState = {
  devices: AudioDevice[];
  selectedSinkId: string | null;
  isSupported: boolean;
  isInitialized: boolean;

  initialize: () => Promise<void>;
  selectDevice: (deviceId: string) => Promise<void>;
  refreshDevices: () => Promise<void>;
};

const enumerateAudioOutputs = async (): Promise<AudioDevice[]> => {
  try {
    const allDevices = await navigator.mediaDevices.enumerateDevices();
    return allDevices
      .filter((d) => d.kind === 'audiooutput')
      .map((d) => ({
        deviceId: d.deviceId,
        groupId: d.groupId,
        label: d.label || `Audio output ${d.deviceId.slice(0, 8)}...`,
      }));
  } catch {
    return [];
  }
};

export const useAudioOutputStore = create<AudioOutputState>((set, get) => ({
  devices: [],
  selectedSinkId: null,
  isSupported: false,
  isInitialized: false,

  initialize: async () => {
    const supportsSetSinkId =
      'setSinkId' in HTMLAudioElement.prototype &&
      typeof HTMLAudioElement.prototype.setSinkId === 'function';

    set({ isSupported: supportsSetSinkId });

    const persistedSinkId = await store.get<string>('selectedSinkId');
    const initialDevices = await enumerateAudioOutputs();

    set({
      devices: initialDevices,
      selectedSinkId: persistedSinkId || null,
      isInitialized: true,
    });

    navigator.mediaDevices.addEventListener('devicechange', () => {
      get().refreshDevices();
    });
  },

  selectDevice: async (deviceId: string) => {
    set({ selectedSinkId: deviceId });
    await store.set('selectedSinkId', deviceId);
    await store.save();
    Logger.playback.debug(`Audio output device: ${deviceId}`);
  },

  refreshDevices: async () => {
    const devices = await enumerateAudioOutputs();
    const { selectedSinkId } = get();

    const stillExists = devices.some((d) => d.deviceId === selectedSinkId);
    set({ devices });

    if (!stillExists && selectedSinkId) {
      set({ selectedSinkId: null });
      await store.set('selectedSinkId', '');
      await store.save();
    }
  },
}));

export const initializeAudioOutputStore = async (): Promise<void> => {
  await useAudioOutputStore.getState().initialize();
};
