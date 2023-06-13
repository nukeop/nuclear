import { handleCertificateError } from '../src/main';
import { app } from 'electron';

jest.mock('electron', () => ({
  app: {
    on: jest.fn(),
    emit: jest.fn(),
    getPath: jest.fn().mockReturnValue('/mocked/path'),
    commandLine: {
      appendSwitch: jest.fn()
    },
    requestSingleInstanceLock: jest.fn(),
    quit: jest.fn()
  },
  TouchBar: {
    TouchBarButton: jest.fn(),
    TouchBarSlider: jest.fn()
  },
  nativeImage: {
    createFromPath: jest.fn().mockReturnValue({})
  }

}));

jest.mock('@nuclear/core');

jest.mock('electron-timber');

jest.mock('electron-store');

beforeEach(() => {
  app.on('certificate-error', handleCertificateError);
});

describe('handleCertificateError', () => {
  it('calls event.preventDefault and callback with true when certificate error event is emitted', () => {
    const event = {
      preventDefault: jest.fn()
    };
    const callback = jest.fn();

    // Mock 'certificate-error' event
    app.emit('certificate-error', event, {}, '', '', {}, callback);

    expect(event.preventDefault).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(true);
  });
});

