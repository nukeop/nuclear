import { NuclearAPI, NuclearPluginAPI } from '@nuclearplayer/plugin-sdk';
import { apiMeta } from '@nuclearplayer/plugin-sdk/mcp';

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
): Promise<unknown> => {
  const [domain, methodName] = method.split('.', 2);
  const methodMeta = apiMeta[domain].methods[methodName];

  const { domainInstance, fn } = getDomainMethod(
    api,
    domain as keyof NuclearAPI,
    methodName as MethodOf<DomainOf<keyof NuclearAPI>>,
  );

  const positionalArgs = methodMeta.params.map((param) => params[param.name]);
  return fn.apply(domainInstance, positionalArgs as never[]) ?? null;
};
