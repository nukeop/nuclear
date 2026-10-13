import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import { FC } from 'react';

import { createRemoteRouter, RemoteRouter } from './remoteRouter';

const defaultQueryClient = new QueryClient();
const defaultRouter = createRemoteRouter();

type RemoteAppProps = {
  queryClientProp?: QueryClient;
  routerProp?: RemoteRouter;
};

const RemoteApp: FC<RemoteAppProps> = ({ queryClientProp, routerProp }) => (
  <QueryClientProvider client={queryClientProp ?? defaultQueryClient}>
    <RouterProvider router={routerProp ?? defaultRouter} />
  </QueryClientProvider>
);

export default RemoteApp;
