import {
  apiMeta,
  NuclearAPI,
  NuclearPluginAPI,
} from '@nuclearplayer/plugin-sdk';

type DispatchResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

type DomainOf<K extends keyof NuclearAPI> = NuclearAPI[K];
type MethodOf<D> = {
  [K in keyof D]: D[K] extends (...args: never[]) => unknown ? K : never;
}[keyof D];

const getDomainMethod = <K extends keyof NuclearAPI>(
  api: NuclearPluginAPI,
  domain: K,
  methodName: MethodOf<DomainOf<K>>,
) => {
  const domainInstance = api[domain];
  return {
    domainInstance,
    fn: domainInstance[methodName as keyof typeof domainInstance] as (
      ...args: never[]
    ) => Promise<unknown>,
  };
};

export const dispatch = async (
  api: NuclearPluginAPI,
  method: string,
  params: Record<string, unknown>,
): Promise<DispatchResult<unknown>> => {
  const [domain, methodName] = method.split('.', 2);

  if (!domain || !methodName) {
    return {
      success: false,
      error: `Invalid method "${method}". Use "Domain.method" format (e.g. "Queue.getQueue").`,
    };
  }

  const domainMeta = apiMeta[domain];
  if (!domainMeta) {
    return { success: false, error: `Unknown domain "${domain}".` };
  }

  const methodMeta = domainMeta.methods[methodName];
  if (!methodMeta) {
    return {
      success: false,
      error: `Unknown method "${methodName}" on ${domain}.`,
    };
  }

  const { domainInstance, fn } = getDomainMethod(
    api,
    domain as keyof NuclearAPI,
    methodName as MethodOf<DomainOf<keyof NuclearAPI>>,
  );

  const positionalArgs = methodMeta.params.map((param) => params[param.name]);

  try {
    const result = await fn.apply(domainInstance, positionalArgs as never[]);
    return { success: true, data: result ?? null };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
};
