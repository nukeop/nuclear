export const MAXIMIZE_WINDOW = 'MAXIMIZE_WINDOW';
export const MINIMIZE_WINDOW = 'MINIMIZE_WINDOW';
export const CLOSE_WINDOW = 'CLOSE_WINDOW';
export const OPEN_DEVTOOLS = 'OPEN_DEVTOOLS';

export const maximizeWindow = () => ({
  type: MAXIMIZE_WINDOW
});

export const minimizeWindow = () => ({
  type: MINIMIZE_WINDOW
});

export const closeWindow = () => ({
  type: CLOSE_WINDOW
});

export const openDevtools = () => ({
  type: OPEN_DEVTOOLS
});
