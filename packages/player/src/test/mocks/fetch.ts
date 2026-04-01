import { type Mock } from 'vitest';

type FetchResponse = {
  ok: boolean;
  status: number;
  statusText: string;
  json: () => Promise<unknown>;
};

type RouteHandler = {
  pattern: string | RegExp;
  response: FetchResponse;
};

const routes: RouteHandler[] = [];

const createResponse = (
  body: unknown,
  options: { ok?: boolean; status?: number; statusText?: string } = {},
): FetchResponse => ({
  ok: options.ok ?? true,
  status: options.status ?? 200,
  statusText: options.statusText ?? 'OK',
  json: async () => body,
});

const findRoute = (url: string): RouteHandler | undefined =>
  routes.find((route) => {
    if (typeof route.pattern === 'string') {
      return url.includes(route.pattern);
    }
    return route.pattern.test(url);
  });

const mockFetchImplementation = async (
  input: RequestInfo | URL,
): Promise<FetchResponse> => {
  const url = typeof input === 'string' ? input : input.toString();
  const route = findRoute(url);

  if (!route) {
    throw new Error(`FetchMock: No route matched for URL: ${url}`);
  }

  return route.response;
};

export const FetchMock = {
  get: (pattern: string | RegExp, body: unknown) => {
    routes.push({
      pattern,
      response: createResponse(body),
    });
    return global.fetch as Mock;
  },

  getError: (
    pattern: string | RegExp,
    status: number,
    statusText = 'Error',
  ) => {
    routes.push({
      pattern,
      response: createResponse(null, { ok: false, status, statusText }),
    });
    return global.fetch as Mock;
  },

  reset: () => {
    routes.length = 0;
  },

  init: () => {
    routes.length = 0;
    vi.spyOn(global, 'fetch').mockImplementation(
      mockFetchImplementation as typeof fetch,
    );
  },
};

vi.spyOn(global, 'fetch').mockImplementation(
  mockFetchImplementation as typeof fetch,
);
