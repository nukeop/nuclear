import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { FC } from 'react';
import { I18nextProvider } from 'react-i18next';

import { i18n } from '@nuclearplayer/i18n';

import { useTrayWindowBehavior } from './hooks/useTrayWindowBehavior';
import { routeTree } from './routeTree.gen';

const router = createRouter({ routeTree });
const defaultQueryClient = new QueryClient();

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

type AppProps = {
  routerProp?: typeof router;
  queryClientProp?: QueryClient;
};

const App: FC<AppProps> = ({ routerProp, queryClientProp }) => {
  useTrayWindowBehavior();

  return (
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClientProp ?? defaultQueryClient}>
        <RouterProvider router={routerProp ?? router} />
      </QueryClientProvider>
    </I18nextProvider>
  );
};

export default App;
