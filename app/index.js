import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { AppContainer } from 'react-hot-loader';
import { ipcRenderer } from 'electron';

import App from './App';
import configureStore from './store/configureStore';
import { onNext } from './mpris';

const store = configureStore();

const render = (Component) => {
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <BrowserRouter>
          <Component />
        </BrowserRouter>
      </Provider>
    </AppContainer>,
    document.getElementById('react_root')
  );
}

ipcRenderer.send('started');
ipcRenderer.on('next', onNext);

render(App);

if (module.hot) {
  module.hot.accept( () => {
    render(App);
    });
  }
