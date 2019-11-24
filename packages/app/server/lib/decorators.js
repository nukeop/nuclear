export function autobind(target, handler, descriptor) {
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


export function mprisListener(event) {
  return (target, handler) => {
    target.mprisEvents = target.mprisEvents || [];
    target.mprisEvents.push({ event, handler });
  };
}

export function ipcListener(event) {
  return (target, handler, descriptor) => {
    target.ipcEvents = target.ipcEvents || [];
    target.ipcEvents.push({ event, handler });

    return autobind(target, handler, descriptor);
  };
}
