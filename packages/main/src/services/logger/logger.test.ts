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

  it('switches to a new file after reaching the 1MB limit on the first one', async () => {
    logger = new Logger();
    const rotateMock = jest.fn();
    const errorLogStream = logger.getErrorLogStream();
    errorLogStream.on('rotation', rotateMock);

    // Wait until the first log file is opened
    await new Promise((resolve) => {
      errorLogStream.on('open', () => {
        resolve(0);
      }
      );
    });
    const fsPromises = await import('fs/promises');
    const fs = await import('fs');
    // @ts-expect-error - for some reason the typing here is wrong
    jest.spyOn(fs, 'access').mockImplementation((
      path: string,
      mode: number,
      cb: (err: Error | null) => void
    ) => {
      if (path === '/user/data/logs/nuclear-error.log') {
        return cb(null);
      } else {
        return cb(new Error());
      }
    });
    logger.error(new Error('test error'));
    (fsPromises.stat as jest.Mock).mockResolvedValueOnce({
      isFile: jest.fn().mockReturnValue(true),
      size: 1024 * 1024 + 1
    });
    logger.error(new Error('limit should be reached here' + 'a'.repeat(1024 * 1024)));

    // Wait for the rotation to complete
    await new Promise((resolve) => {
      errorLogStream.on('rotated', () => {
        resolve(0);
      }
      );
    });

    expect(fsPromises.stat).toHaveBeenCalledWith('/user/data/logs/nuclear-error.log');
    expect(rotateMock).toHaveBeenCalled();
    expect(fsPromises.open).toHaveBeenNthCalledWith(1, '/user/data/logs/nuclear-error.log', 'a', undefined);
    expect(fsPromises.open).toHaveBeenNthCalledWith(2, '/user/data/logs/nuclear-error.2.log', 'a', undefined);
  });
});
