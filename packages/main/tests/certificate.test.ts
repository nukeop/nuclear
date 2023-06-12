// import handleCertificateError from main.ts
// import { app } from 'electron';
import { handleCertificateError } from '../src/main';
import { app } from 'electron';


jest.mock('electron', () => ({
  app: {
    on: jest.fn(),
    emit: jest.fn(),
    getPath: jest.fn().mockReturnValue('/mocked/path') // Add this line
  }
 
}));

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

