import 'regenerator-runtime';

import 'semantic-ui-css/semantic.min.css';
import 'font-awesome/css/font-awesome.css';

import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { AppContainer, setConfig } from 'react-hot-loader';
import { I18nextProvider } from 'react-i18next';
import { remote } from 'electron';
import { getOption, setOption } from '@nuclear/core';
import i18n, { setupI18n } from '@nuclear/i18n';

import App from './App';
import configureStore from './store/configureStore';

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
    }
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
