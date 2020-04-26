/* eslint-disable @typescript-eslint/no-explicit-any */

// Nuclear plugin API, which defines the functionality exposed to plugins
import React from 'react';
import ReactDOM from 'react-dom';
import electron from 'electron';

export default () => ({
  app: electron.remote.app,
  store: (window as any).store,
  React, ReactDOM
});
