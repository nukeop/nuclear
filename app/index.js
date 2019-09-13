import 'regenerator-runtime';
import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { AppContainer } from 'react-hot-loader';
import { I18nextProvider } from 'react-i18next';
import logger from 'electron-timber';

import i18n, { setupI18n } from './i18n';
import App from './App';
import configureStore from './store/configureStore';

const store = configureStore();
logger.hookConsole({
	renderer: true
});

// Sentry
process.env.NODE_ENV === 'production' &&
  Raven.config('https://2fb5587831994721a8b5f77bf6010679@sentry.io/1256142').install();

const render = async Component => {
  await setupI18n();

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
