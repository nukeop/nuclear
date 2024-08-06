
import Logger from '.';

jest.mock('electron-timber', () => ({
  error: jest.fn(),
  hookConsole: jest.fn()
}));

jest.mock('electron', () => ({
  app: {
    getPath: jest.fn().mockImplementation(() => '/user/data')
  }
}));


jest.mock('fs/promises', () => {
  const writeFileMock = jest.fn();
  const closeFileMock = jest.fn();
  return ({
    open: jest.fn().mockResolvedValue({
      write: jest.fn(),
      close: jest.fn()
    }),
    stat: jest.fn().mockResolvedValue({
      isFile: jest.fn().mockReturnValue(true),
      size: 0
    }),
    writeFile: jest.fn().mockResolvedValue({}),
    mkdir: jest.fn().mockResolvedValue({}),
    closeFileMock,
    writeFileMock
  });
});

jest.mock('fs', () => ({
  constants: jest.requireActual('fs').constants,
  access: jest.fn().mockResolvedValue({}),
  createReadStream: jest.fn(() => ({
    once: jest.fn(),
    pipe: jest.fn(() => ({
      ...jest.requireActual('stream').Writable.prototype,
      write: jest.fn(),
      end: jest.fn(),
      emit: jest.fn()
    }))
  })),
  createWriteStream: jest.fn(() => ({
    once: jest.fn(),
    emit: jest.fn()
  }))
}));

describe('logger', () => {
  let logger: Logger;

  it('creates a file for logs', async () => {
    logger = new Logger();
    const errorLogStream = logger.getErrorLogStream();
    await new Promise((resolve) => {
      errorLogStream.on('open', () => {
        resolve(0);
      }
      );
    });

    const fsPromises = await import('fs/promises');
    logger.error(new Error('test error'));

    expect(fsPromises.stat).toHaveBeenCalledWith('/user/data/logs/nuclear-error.log');
    expect(fsPromises.open).toHaveBeenCalledWith('/user/data/logs/nuclear-error.log', 'a', undefined);
  });
});
