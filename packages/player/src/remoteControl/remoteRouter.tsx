import {
  createBrowserHistory,
  createRouter,
  RouterHistory,
} from '@tanstack/react-router';

import RemoteControl from './RemoteControl';
import { RemoteLyricsPage } from './RemoteLyricsPage';
import { RemoteRoot } from './RemoteRoot';
import { indexRoute, lyricsRoute, rootRoute } from './remoteRoutes';

const routeTree = rootRoute
  .update({ component: RemoteRoot })
  .addChildren([
    indexRoute.update({ component: RemoteControl }),
    lyricsRoute.update({ component: RemoteLyricsPage }),
  ]);

export const createRemoteRouter = (
  history: RouterHistory = createBrowserHistory(),
) => createRouter({ routeTree, history });

export type RemoteRouter = ReturnType<typeof createRemoteRouter>;
