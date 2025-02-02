// Nuclear plugin API, which defines the functionality exposed to plugins
import React from 'react';
import ReactDOM from 'react-dom';

export default () => ({
  store: (window as any).store,
  React, ReactDOM
});
