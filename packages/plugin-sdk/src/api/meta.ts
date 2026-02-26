import { QueueAPIMeta } from './queue.meta';

export type ParamMeta = {
  name: string;
  type: string;
};

export type MethodMeta = {
  description: string;
  params: ParamMeta[];
  returns: string;
};

export type DomainMeta = {
  description: string;
  methods: Record<string, MethodMeta>;
};

export type ApiMeta = Record<string, DomainMeta>;

export const apiMeta: ApiMeta = {
  Queue: QueueAPIMeta,
};
