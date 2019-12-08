import { createContainer, asClass, asValue, Lifetime } from 'awilix';

/**
 * @typedef {Object} IpcEvent
 * @property {string} eventName
 * @property {string} handler
 * @property {boolean} once
 * 
 * @typedef {Function} IpcControllers
 * @property {IpcEvent[]} ipcEvents
 * 
 * @typedef {Object} ServiceProvider
 * @property {string} provide
 * @property {Function} [useClass]
 * @property {Object} [useValue] 
 * 
 * @typedef {Object} ContainerDependencies
 * @property {IpcControllers[]} ipcControllers
 * @property {IpcControllers[]} ipcControllers
 * @property {ServiceProvider[]} services
 * 
 * @typedef {Object} ContainerOptions
 * @property {import('electron').IpcMain} ipc
 * @property {(error: Error) => void} onError
 */

/**
 * Container is responsible for ioc and ipc event listening
 * Ioc is managed via awilix library
 * @see {@link https://github.com/jeffijoe/awilix}
 */
class Container {
  /**
   * Instanciate an Awilix container and registers controllers and service
   * @param {ContainerDependencies} param0 
   * @param {ContainerOptions} param1 
   */
  constructor(
    { ipcControllers, services = [] },
    { ipc, onError }
  ) {
    this.container = createContainer();
    this.ipcControllers = ipcControllers;
    this.onError = onError;
    this.ipc = ipc;

    services.push({ provide: 'ipc', useValue: ipc });

    this.registerServices(services);

    ipcControllers.forEach((Controller) => {
      this.container.register({
        [Controller.name]: asClass(Controller, { lifetime: Lifetime.SINGLETON })
      });
    });
  }

  /**
   * bind an event to its handler
   * @private
   * @param {Object} controller 
   * @param {IpcEvent} param1 
   */
  _addListener(controller, { eventName, handler, once }) {
    const addListener = once ? this.ipc.once : this.ipc.on;

    addListener.bind(this.ipc)(eventName, (event, data) => {
      if (this.logger) {
        this.logger.log(`Incomming event => ${eventName}`);
      }
      const result = controller[handler](event, data);

      if (result instanceof Promise) {
        result.catch((err) => {
          this.logger.error(`Error in event ${eventName} => ${err.message}`);
          this.onError && this.onError(err);
        });
      }
    });
  }

  /**
   * register services to Awilix container
   * @param {ServiceProvider[]} services 
   */
  registerServices(services) {
    if (this.isListening) {
      throw new Error('unable to register service while listening');
    }
    services.forEach(({ provide, useClass, useValue }) => {
      if (useClass) {
        this.container.register({
          [provide]: asClass(useClass, { lifetime: Lifetime.SINGLETON })
        });
      } else if (useValue) {
        this.container.register({
          [provide]: asValue(useValue)
        });
      }
    });
  }

  /**
   * Resolve the required awilix service
   * @param {string} serviceName 
   * @returns {Object}
   */
  resolve(serviceName) {
    return this.container.resolve(serviceName);
  }

  /**
   * start the app, make all the registered event to listen for ipc.
   */
  ipcListen() {
    this.logger = this.container.resolve('ipcLogger');
    this.ipcControllers.forEach(Controller => {
      const controller = this.container.resolve(Controller.name);

      Controller.prototype.ipcEvents.forEach((eventInfo) => {
        this._addListener(controller, eventInfo);
      });
    });

    this.logger.log('Ipc container listening ...');
    this.isListening = true;
  }

  /**
   * unlisten for all the registered events
   */
  close() {
    this.ipcControllers.forEach(Controller => {
      Controller.prototype.ipcEvents.forEach(({ event }) => {
        this.ipc.removeAllListeners(event);
        this.logger.log(`ipc events of ${Controller.name} unsuscribed`);
      });
    });

    this.isListening = false;
  }
}

export default Container;
