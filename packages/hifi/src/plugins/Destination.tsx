import { pluginFactory } from '../pluginFactory';

type DestinationProps = Record<string, unknown>;

export const Destination = pluginFactory<
  DestinationProps,
  AudioDestinationNode
>({
  createNode(ctx: AudioContext) {
    return ctx.destination;
  },
});
