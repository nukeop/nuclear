import 'regenerator-runtime';

import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { AppContainer } from 'react-hot-loader';
import { I18nextProvider } from 'react-i18next';
import logger from 'electron-timber';
import Img from 'react-image-smooth-loading';

import artPlaceholder from '../resources/media/art_placeholder.png';
import i18n, { setupI18n } from './i18n';
import App from './App';
import configureStore from './store/configureStore';

logger.hookConsole({
  renderer: true
});

const store = configureStore();
window.store = store; // put store in global scope for plugins
// Global image placeholder
Img.globalPlaceholder = artPlaceholder;

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
