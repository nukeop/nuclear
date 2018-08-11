import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { AppContainer } from 'react-hot-loader';

import App from './App';
import configureStore from './store/configureStore';

const store = configureStore();

// Sentry
process.env.NODE_ENV === 'production' &&
  Raven.config('https://2fb5587831994721a8b5f77bf6010679@sentry.io/1256142').install();

const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <MemoryRouter>
          <Component />
        </MemoryRouter>
      </Provider>
    </AppContainer>,
    document.getElementById('react_root')
  );
};

render(App);

if (module.hot) {
  module.hot.accept( () => {
    render(App);
  });
}
