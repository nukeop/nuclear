/**
 * Automaticaly bind the method to its own class (usefull for event handler)
 * @param {Function} target 
 * @param {string} handler 
 * @param {Object} descriptor 
 */
function autobind(target, handler, descriptor) {
  return {
    configurable: true,
    get() {
      return descriptor.value.bind(this);
    },
    set(value) {
      descriptor.value = value;
      delete this[handler];
    }
  };
}

/**
 * Register the decorated method to the given mpris event
 * @param {string} event 
 */
function mprisListener(event) {
  return (target, handler, descriptor) => {
    target.mprisEvents = target.mprisEvents || [];
    target.mprisEvents.push({ event, handler });

    return autobind(target, handler, descriptor);
  };
}

/**
 * Register the decorated method to the given ipc event
 * @param {string} eventName 
 * @param {{ once: boolean }} options 
 */
function ipcListener(eventName, options = {}) {
  return (target, handler, descriptor) => {
    target.ipcEvents = target.ipcEvents || [];
    target.ipcEvents.push({ eventName, handler, once: !!options.once });

    return autobind(target, handler, descriptor);
  };
}

export {
  autobind,
  mprisListener,
  ipcListener
};
