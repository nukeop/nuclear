import { openUrl } from '@tauri-apps/plugin-opener';

import type { ShellHost } from '@nuclearplayer/plugin-sdk';

export const shellHost: ShellHost = {
  async openExternal(url: string) {
    await openUrl(url);
  },
};
