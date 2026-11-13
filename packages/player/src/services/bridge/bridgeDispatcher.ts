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
  const domainMeta = apiMeta[domain];
  if (!domainMeta) {
    throw new Error(
      `Unknown domain: '${domain}'. Available domains: ${Object.keys(apiMeta).join(', ')}.`,
    );
  }

  const methodMeta = domainMeta.methods[methodName];
  if (!methodMeta) {
    throw new Error(
      `Unknown method '${methodName}' in domain '${domain}'. Available methods: ${Object.keys(domainMeta.methods).join(', ')}.`,
    );
  }

  const missingParam = methodMeta.params.find(
    (param) => !param.type.endsWith('?') && params[param.name] === undefined,
  );
  if (missingParam) {
    throw new Error(
      `Missing parameter '${missingParam.name}' of ${domain}.${methodName}.`,
    );
  }

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
