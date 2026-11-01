import type { CustomViewRoute } from '@nuclearplayer/plugin-sdk';

type ViewRouteMatch = {
  route: CustomViewRoute;
  params: Record<string, string>;
};

const toSegments = (path: string) =>
  path.split('/').filter((segment) => segment !== '');

export class ViewRouteTable {
  #entries: { route: CustomViewRoute; segments: string[] }[];

  constructor(routes: CustomViewRoute[]) {
    this.#entries = routes.map((route) => ({
      route,
      segments: toSegments(route.path),
    }));
  }

  match(path: string): ViewRouteMatch | undefined {
    const pathSegments = toSegments(path);
    for (const { route, segments } of this.#entries) {
      const params = this.#matchSegments(segments, pathSegments);
      if (params) {
        return { route, params };
      }
    }
    return undefined;
  }

  #matchSegments(
    patternSegments: string[],
    pathSegments: string[],
  ): Record<string, string> | undefined {
    if (patternSegments.length !== pathSegments.length) {
      return undefined;
    }
    const params: Record<string, string> = {};
    for (const [index, patternSegment] of patternSegments.entries()) {
      const pathSegment = pathSegments[index];
      if (patternSegment.startsWith('$')) {
        params[patternSegment.slice(1)] = pathSegment;
      } else if (patternSegment !== pathSegment) {
        return undefined;
      }
    }
    return params;
  }
}
