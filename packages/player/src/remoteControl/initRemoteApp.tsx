import React from 'react';

import RemoteApp from './RemoteApp';

export const initRemoteApp = (
  root: ReturnType<typeof import('react-dom/client').createRoot>,
) => {
  root.render(
    <React.StrictMode>
      <RemoteApp />
    </React.StrictMode>,
  );
};
