import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { AppContainer } from 'react-hot-loader';

import App from './App';
import configureStore from './store/configureStore';

const store = configureStore();

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
