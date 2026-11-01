import { toast } from 'sonner';

import { i18n } from '@nuclearplayer/i18n';

import type { RegisteredCustomView } from '../stores/customViewsStore';
import { formatLogValue, Logger } from './logger';

export const handleCustomViewCrash = (
  { pluginId, pluginName, view, api }: RegisteredCustomView,
  error: unknown,
): void => {
  api.Views.unregister(view.id);

  void Logger.plugins.error(
    `Custom view "${view.id}" from plugin "${pluginId}" crashed: ${formatLogValue(error)}`,
  );

  toast.error(
    i18n.t('plugins:viewCrashed', { title: view.title, pluginName }),
    { testId: 'custom-view-crash-toast' },
  );
};
