import { i18n } from '@nuclearplayer/i18n';
import type { Track } from '@nuclearplayer/model';

import { useQueueStore } from '../stores/queueStore';
import { useSettingsStore } from '../stores/settingsStore';
import { reportError } from '../utils/logging';
import { discoveryHost } from './discoveryHost';
import { eventBus } from './eventBus';

const CONTEXT_SIZE = 10;
const RECOMMENDATION_LIMIT = 5;

export const initDiscoveryService = () => {
  return eventBus.on('trackFinished', async () => {
    const isEnabled = useSettingsStore
      .getState()
      .getValue('core.playback.discovery');
    if (!isEnabled) {
      return;
    }

    const { items, currentIndex } = useQueueStore.getState();
    const isLastTrack = currentIndex >= items.length - 1;
    if (!isLastTrack) {
      return;
    }

    const variety =
      (useSettingsStore
        .getState()
        .getValue('core.playback.discoveryVariety') as number) ?? 0.5;

    const contextTracks: Track[] = items
      .slice(-CONTEXT_SIZE)
      .map((item) => item.track);

    try {
      const recommendations = await discoveryHost.getRecommendations(
        contextTracks,
        { variety, limit: RECOMMENDATION_LIMIT },
      );

      if (recommendations.length > 0) {
        useQueueStore.getState().addToQueue(recommendations);
      }
    } catch (error) {
      reportError('discovery', {
        userMessage: i18n.t('discovery:recommendationError'),
        error,
      });
    }
  });
};
