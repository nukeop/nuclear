import { handleCertificateError } from '../src/certificate';

describe('handleCertificateError', () => {
  it('calls event.preventDefault and callback with true when certificate error event is emitted', () => {
    const event = {
      preventDefault: jest.fn()
    };
    const callback = jest.fn();

    // Mock 'certificate-error' event
    handleCertificateError(event, {}, '', '', {}, callback);

    expect(event.preventDefault).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(true);
  });
});

