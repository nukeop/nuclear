import { useCallback } from 'react';
import { post } from '@nuclear/core/src/rest/Mastodon';

export const useMastodonPost = (instanceUrl: string, accessToken: string) => {
  return useCallback((content: string) => {
    post(instanceUrl, accessToken, content);
  }, [instanceUrl, accessToken]);
};
