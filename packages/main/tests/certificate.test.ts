// import handleCertificateError from main.ts
// import { app } from 'electron';
import { handleCertificateError } from '../src/main';


jest.mock('electron', () => ({
  app: {
    on: jest.fn(),
    getPath: jest.fn().mockReturnValue('/mocked/path') // Add this line
  }
}));

// Tests for the certificate error handler
describe('handleCertificateError', () => {
  it('calls preventDefault and callback with true', () => {
    const preventDefault = jest.fn();
    const callback = jest.fn();
    handleCertificateError({ preventDefault }, null, null, null, null, callback);
    expect(preventDefault).toHaveBeenCalled();
    expect(callback).toHaveBeenCalledWith(true);
  });
});
