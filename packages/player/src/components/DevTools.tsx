import { TanStackDevtools } from '@tanstack/react-devtools';
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';
import { FC } from 'react';

import { registerZustandStores } from '../devtools/registerZustandStores';
import { ZustandDevtoolsPanel } from './devtools/ZustandDevtoolsPanel';

if (import.meta.env.DEV) {
  registerZustandStores();
}

export const DevTools: FC = () => {
  if (import.meta.env.MODE === 'test') {
    return null;
  }

  return (
    <TanStackDevtools
      plugins={[
        {
          name: 'React Query',
          render: <ReactQueryDevtoolsPanel />,
        },
        {
          name: 'React Router',
          render: <TanStackRouterDevtoolsPanel />,
        },
        {
          name: 'Zustand',
          render: <ZustandDevtoolsPanel />,
        },
      ]}
    />
  );
};
