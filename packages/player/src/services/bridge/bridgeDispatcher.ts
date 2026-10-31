import { NuclearPluginAPI } from '@nuclearplayer/plugin-sdk';
import { apiMeta, ParamMeta } from '@nuclearplayer/plugin-sdk/mcp';

import { createPluginAPI } from '../plugins/createPluginAPI';
import { hydrateView, RawViewDefinition } from './hydrateView';

const bridgeApi: NuclearPluginAPI = createPluginAPI('bridge', 'Bridge');

const paramHydrators: Record<string, (value: unknown) => Promise<unknown>> = {
  RawViewDefinition: (value) => hydrateView(value as RawViewDefinition),
};

const toArgument = async (
  param: ParamMeta,
  params: Record<string, unknown>,
): Promise<unknown> => {
  const value = params[param.name];
  const hydrate = paramHydrators[param.type];
  if (!hydrate) {
    return value;
  }
  return hydrate(value);
};

const dispatchPluginApi = async (
  domain: string,
  methodName: string,
  params: Record<string, unknown>,
): Promise<unknown> => {
  const methodMeta = apiMeta[domain].methods[methodName];

  const domainInstance = bridgeApi[domain as keyof NuclearPluginAPI];
  const fn = domainInstance[methodName as keyof typeof domainInstance] as (
    ...args: never[]
  ) => Promise<unknown>;

  const positionalArgs = await Promise.all(
    methodMeta.params.map((param: ParamMeta) => toArgument(param, params)),
  );
  return fn.apply(domainInstance, positionalArgs as never[]) ?? null;
};

export const dispatch = async (
  method: string,
  params: Record<string, unknown>,
): Promise<unknown> => {
  const [domain, methodName] = method.split('.', 2);
  return dispatchPluginApi(domain, methodName, params);
};
