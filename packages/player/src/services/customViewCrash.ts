import { toast } from 'sonner';

import { i18n } from '@nuclearplayer/i18n';

import { customViewKey, useCustomViewsStore } from '../stores/customViewsStore';
import { formatLogValue, Logger } from './logger';

export const handleCustomViewCrash = (
  pluginId: string,
  viewId: string,
  error: unknown,
): void => {
  const registered =
    useCustomViewsStore.getState().views[customViewKey(pluginId, viewId)];
  if (!registered) {
    return;
  }
  const { pluginName, view, api } = registered;

  api.Views.unregister(view.id);

  void Logger.plugins.error(
    `Custom view "${view.id}" from plugin "${pluginId}" crashed: ${formatLogValue(error)}`,
  );

  toast.error(
    i18n.t('plugins:viewCrashed', { title: view.title, pluginName }),
    { testId: 'custom-view-crash-toast' },
  );
};
