import 'reflect-metadata';
import IpcPlayer from './player';

import Discord from '../services/discord';
import Config from '../services/config';

jest.mock('../services/discord', () => {
  return function () {
    return {
      clear: jest.fn().mockRejectedValue(new Error('discord failed to clear'))
    };
  };
});

jest.mock('../services/logger');

describe('IPC Player controller', () => {
  beforeAll(() => {
    process.env.ACOUSTIC_ID_KEY = 'acoustic_id_key';
    process.env.DISCORD_CLIENT_ID = 'discord_client_id';
  });
  it('catches the error if Discord service throws it on queue clear', async () => {
    const systemApi = jest.fn() as any;
    const logger = {
      log: jest.fn(),
      error: jest.fn()
    } as any;

    const ipc = new IpcPlayer(
      new Discord(new Config(logger), null),
      null,
      systemApi,
      null,
      logger
    );
    await ipc.onClearTrackList();

    return expect(logger.error).toHaveBeenCalledWith(
      'Main process failed to react to IPC clear queue event'
    );
  });
});
