import 'regenerator-runtime';

import 'semantic-ui-css/semantic.min.css';
import 'font-awesome/css/font-awesome.css';

import 'react-hot-loader/root';
import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import { getOption, setOption } from '@nuclear/core';
import i18n, { setupI18n } from '@nuclear/i18n';

import App from './App';
import configureStore from './store/configureStore';
import { app } from 'electron';

const store = configureStore({});

i18n.on('languageChanged', lng => setOption('language', lng));

const render = async Component => {
  await setupI18n({
    languageDetector: {
      init: () => {},
      type: 'languageDetector',
      detect: () => getOption('language') || app.getLocale(),
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
