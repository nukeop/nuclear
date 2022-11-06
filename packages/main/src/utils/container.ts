/* eslint-disable @typescript-eslint/no-explicit-any */
import { Event, IpcMain } from 'electron';
import { EventEmitter } from 'events';
import { Container as InversifyContainer } from 'inversify';
import { Class } from 'type-fest';

import ipcService from '../services/ipc';
import Logger, { $ipcLogger, $mainLogger } from '../services/logger';
import { IPC_EVENT_KEY, IPC_INVOKE_KEY } from '../utils/decorators';
import { AppDependencies, ControllerMeta, AsyncServiceProvider } from './types';

class Container extends InversifyContainer {
  controllers: Class[];

  constructor({ controllers, services }: AppDependencies) {
    super({ skipBaseClassChecks: true });
    this.controllers = controllers;

    services.forEach(({ provide, useClass, useValue }) => {
      if (useClass) {
        this.bind(provide || useClass).to(useClass).inSingletonScope();
      } else if (useValue) {
        this.bind(provide as any).toConstantValue(useValue);
      }
    });
  }

  async bindAsync({ provide, usePromise }: AsyncServiceProvider): Promise<void> {
    const { default: service } = await usePromise;
    const logger = this.get<Logger>($mainLogger);

    logger.log(`Async service loaded => ${service.name}`);

    this.bind(provide).to(service).inSingletonScope();
  }

  listen(): void {
    const ipc = this.get<IpcMain>(ipcService);
    const logger = this.get<Logger>($ipcLogger);

    this.controllers.forEach((Controller) => {
      try {
        this.bind(Controller).to(Controller).inSingletonScope();
        const meta: ControllerMeta[] = Reflect.getMetadata(IPC_EVENT_KEY, Controller.prototype);
        const invokeHandlerMeta: ControllerMeta[] = Reflect.getMetadata(
          IPC_INVOKE_KEY,
          Controller.prototype
        );

        const controller = this.get(Controller);
        meta.forEach(({ eventName, name, once }) => {
          const on = once ? ipc.once : ipc.on;

          on.bind(ipc)(eventName, (event: Event, data: any) => {
            logger.logEvent({ once, direction: 'in', event: eventName, data });

            const result = controller[name](event, data);

            if (result instanceof Promise) {
              result.catch((err: any) => {
                logger.error(`error in event ${eventName} => ${err.message}`);
                logger.error(err.stack);
              });
            }
          });
        });

        invokeHandlerMeta?.forEach(({ eventName, name }) => {
          ipc.handle(eventName, async (event: Event, data: any) => {
            logger.logEvent({ direction: 'in', event: eventName, data });
            const result = await controller[name](event, data);
            logger.logEvent({ direction: 'out', event: eventName, data: result });
            return result;
          });
        });
      } catch (e) {
        logger.error('Service failed to initialize');
        logger.error(e);
      }
    });
  }
}

export default Container;
