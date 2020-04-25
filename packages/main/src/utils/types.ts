/* eslint-disable @typescript-eslint/no-explicit-any */
import { Class } from 'type-fest';

export type MediaEventName =
  | 'play'
  | 'pause'
  | 'playpause'
  | 'stop'
  | 'next'
  | 'previous'
  | 'volume'
  | 'seek'
  | 'activatePlaylist'
  | 'raise'
  | 'quit'
  | 'shuffle'
  | 'loopStatus'
  | 'goTo';

export interface ServiceProvider {
  provide?: symbol | Class | string;
  useClass?: Class;
  useValue?: any;
}

export interface AsyncServiceProvider {
  provide: symbol | Class | string;
  usePromise: Promise<{ default: Class }>;
}

export interface AppDependencies {
  controllers: Class[];
  services: ServiceProvider[];
}

export interface AppOptions {
  logger?: {
    log(message: string): void;
    error(err: any): void;
  };
}

export interface ControllerMeta<E = string> {
  eventName: E;
  name: string;
  once?: boolean;
}

export type ClassDecorator<Target = any, Return = void> = (...args: any[]) => (target: Class<Target>) => Return;

export type MethodDecorator<T = any, O = any, Return = void> = (arg1: T, arg2?: O) => (target: Class['prototype'], name: string) => Return;
