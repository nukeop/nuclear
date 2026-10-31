import type { AnyRouter } from '@tanstack/react-router';

import type { NavigationHost } from '@nuclearplayer/plugin-sdk';

let mountedRouter: AnyRouter;

export const mountNavigationRouter = (router: AnyRouter) => {
  mountedRouter = router;
};

export const navigationHost: NavigationHost = {
  async navigate(path) {
    await mountedRouter.navigate({ href: path });
  },
  back() {
    mountedRouter.history.back();
  },
  forward() {
    mountedRouter.history.forward();
  },
  current() {
    const { href, pathname, search, hash } = mountedRouter.latestLocation;
    return { href, pathname, search, hash };
  },
};
