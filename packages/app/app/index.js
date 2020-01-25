import 'regenerator-runtime';

import 'font-awesome/css/font-awesome.css';
import 'semantic-ui-css/semantic.min.css';

import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { AppContainer, setConfig } from 'react-hot-loader';
import { I18nextProvider } from 'react-i18next';
import logger from 'electron-timber';
import i18n, { setupI18n } from '@nuclear/i18n';
import { remote } from 'electron';

import App from './App';
import configureStore from './store/configureStore';
import { getOption, setOption } from './persistence/store';

setConfig({
  showReactDomPatchNotification: false
});

const store = configureStore();
window.store = store; // put store in global scope for plugins

i18n.on('languageChanged', lng => setOption('language', lng));

const render = async Component => {
  await setupI18n({
    languageDetector: {
      init: Function.prototype,
      type: 'languageDetector',
      detect: () => getOption('language') || remote.app.getLocale(),
      cacheUserLanguage: Function.prototype
    },
    react: true
  });

  ReactDOM.render(
    <AppContainer>
      <I18nextProvider i18n={i18n}>
        <Provider store={store}>
          <MemoryRouter>
            <Component />
          </MemoryRouter>
        </Provider>
      </I18nextProvider>
    </AppContainer>,
    document.getElementById('react-root')
  );
};

render(App);

if (module.hot) {
  module.hot.accept(() => {
    render(App);
  });
}
