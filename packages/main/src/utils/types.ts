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
  logger?: Logger;
}

export interface ControllerMeta<E = string> {
  eventName: E;
  name: string;
  once?: boolean;
}

export interface Logger {
  log(message: string): void;
  error(err: any): void;
}

export type ClassDecorator<Target = any, Return = void> = (...args: any[]) => (target: Class<Target>) => Return;

export type MethodDecorator<Return = void> = (...args: any[]) => (target: Class['prototype'], name: string) => Return;
