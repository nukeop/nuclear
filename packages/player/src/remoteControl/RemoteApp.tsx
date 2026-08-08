import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FC } from 'react';

import RemoteControl from './RemoteControl';

const defaultQueryClient = new QueryClient();

type RemoteAppProps = {
  queryClientProp?: QueryClient;
};

const RemoteApp: FC<RemoteAppProps> = ({ queryClientProp }) => (
  <QueryClientProvider client={queryClientProp ?? defaultQueryClient}>
    <RemoteControl />
  </QueryClientProvider>
);

export default RemoteApp;
