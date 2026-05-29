import ReactDOM from 'react-dom/client';

import '@nuclearplayer/tailwind-config';
import '@nuclearplayer/themes';
import '@nuclearplayer/i18n';

const root = ReactDOM.createRoot(document.getElementById('root')!);
const isTauri = !!(window as Window & { __TAURI_INTERNALS__?: unknown })
  .__TAURI_INTERNALS__;

// Dynamic imports avoid loading Tauri modules in the browser
if (isTauri) {
  const { initPlayerApp } = await import('./initPlayerApp');
  await initPlayerApp(root);
} else {
  const { initRemoteApp } = await import('./remoteControl');
  initRemoteApp(root);
}
