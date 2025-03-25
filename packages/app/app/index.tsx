/* eslint-disable @typescript-eslint/no-var-requires */
import 'regenerator-runtime';

import 'semantic-ui-css/semantic.min.css';
import 'font-awesome/css/font-awesome.css';

import 'react-hot-loader/root';
import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import { getOption, setOption, IpcEvents } from '@nuclear/core';
import i18n, { setupI18n } from '@nuclear/i18n';
import { setTimeout, setInterval } from 'timers';
import { ipcRenderer } from 'electron';

import App from './App';
import configureStore from './store/configureStore';

const store = configureStore({});

/* 
* The `setTimeout` and `setInterval` functions are overridden to use the Node.js timers module. This is necessary because the default browser implementations of `setTimeout` and `setInterval` will not work correctly with unidici, so we use the Node versions.
*/
window.setTimeout = ((handler: TimerHandler, timeout?: number, ...args: any[]) => setTimeout(handler, timeout, ...args)) as typeof setTimeout;
window.setInterval = ((handler: TimerHandler, timeout?: number, ...args: any[]) => setInterval(handler, timeout, ...args)) as typeof setInterval;

i18n.on('languageChanged', lng => setOption('language', lng));

const initializeLanguage = async (): Promise<string> => {
  const savedLanguage = getOption('language') as string;
  if (savedLanguage) {
    return savedLanguage;
  }

  try {
    const systemInfo = await ipcRenderer.invoke(IpcEvents.GET_SYSTEM_INFO);
    return systemInfo.locale || 'en';
  } catch (error) {
    console.error('Failed to get system locale:', error);
    return 'en';
  }
};

const render = async (Component: typeof App) => {
  const initialLanguage = await initializeLanguage();
  
  await setupI18n({
    languageDetector: {
      init: () => {},
      type: 'languageDetector',
      detect: () => initialLanguage,
      cacheUserLanguage: () => {}
    }
  });

  ReactDOM.render(
    <I18nextProvider i18n={i18n}>
      <Provider store={store}>
        <MemoryRouter>
          <Component />
        </MemoryRouter>
      </Provider>
    </I18nextProvider>,
    document.getElementById('react-root')
  );
};

render(App);
