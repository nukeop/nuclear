export const app = {
  on: jest.fn(),
  emit: jest.fn(),
  getPath: () => '',
  commandLine: {
    appendSwitch: jest.fn()
  },
  requestSingleInstanceLock: jest.fn(),
  quit: jest.fn()
};
export const TouchBar = {
  TouchBarButton: jest.fn(),
  TouchBarSlider: jest.fn()
};
export const nativeImage = {
  createFromPath: jest.fn().mockReturnValue({})
};
