import React from 'react';

import RemoteControl from './RemoteControl';

export const initRemoteApp = (
  root: ReturnType<typeof import('react-dom/client').createRoot>,
) => {
  root.render(
    <React.StrictMode>
      <RemoteControl />
    </React.StrictMode>,
  );
};
