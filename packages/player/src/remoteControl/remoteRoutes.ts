import { createRootRoute, createRoute } from '@tanstack/react-router';

export const rootRoute = createRootRoute();

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
});

export const lyricsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/lyrics',
});
