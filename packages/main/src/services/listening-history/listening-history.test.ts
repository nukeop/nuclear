import Config from '../config';
import { TestLogger } from '../../../tests/test-logger';
import ListeningHistoryDb from './db';

describe('Listening history', () => {
  let Db: ListeningHistoryDb;
  beforeAll(() => {
    jest.mock('electron', () => ({
      app: {
        getPath: jest.fn().mockImplementation(() => '')
      }
    }));

    Db = new ListeningHistoryDb(new TestLogger(), {
      listeningHistoryDbName: ':memory:'
    } as Config);
  });

  beforeEach(async () => {
    await Db.connect();
    await Db.deleteEntriesWithFilters({});
  });

  it('should post an entry', async () => {
    const now = new Date();
    await Db.postEntry('artist', 'title');
    const entries = await Db.getEntries();
    expect(entries.length).toBe(1);
    expect(entries[0].artist).toBe('artist');
    expect(entries[0].title).toBe('title');
    expect(Math.abs(entries[0].createdAt.valueOf() - now.valueOf())).toBeLessThan(1000);
  });

  it('should get entries with filters', async () => {
    await Db.postEntry('artist', 'title');
    await Db.postEntry('artist', 'title2');
    await Db.postEntry('artist2', 'title');
    await Db.postEntry('artist2', 'title2');
    const entries = await Db.getEntriesWithFilters({
      artist: 'artist',
      title: 'title'
    });
    expect(entries.length).toBe(1);
    expect(entries[0].artist).toBe('artist');
    expect(entries[0].title).toBe('title');
  });

  it('should delete entries with filters', async () => {
    await Db.postEntry('artist', 'title');
    await Db.postEntry('artist', 'title2');
    await Db.postEntry('artist2', 'title');
    await Db.postEntry('artist2', 'title2');
    await Db.deleteEntriesWithFilters({
      artist: 'artist'
    });
    const entries = await Db.getEntries();
    expect(entries.length).toBe(2);
    expect(entries[0]).toEqual(expect.objectContaining({
      artist: 'artist2',
      title: 'title'
    }));
    expect(entries[1]).toEqual(expect.objectContaining({
      artist: 'artist2',
      title: 'title2'
    }));
  });

  it('should get entries for dates', async () => {
    const entry1 = await Db.postEntry('artist', 'title');
    const entry2 = await Db.postEntry('artist', 'title2');
    const entry3 = await Db.postEntry('artist2', 'title');
    const entry4 = await Db.postEntry('artist2', 'title2');

    const repository = await Db.getRepository();
    await repository.update(entry1.uuid, {
      createdAt: new Date(2019, 1, 1)
    });
    await repository.update(entry2.uuid, {
      createdAt: new Date(2019, 1, 2)
    });
    await repository.update(entry3.uuid, {
      createdAt: new Date(2019, 1, 3)
    });
    await repository.update(entry4.uuid, {
      createdAt: new Date(2019, 1, 4)
    });

    const entries = await Db.getEntriesForDates(
      new Date(2019, 1, 1), 
      new Date(2019, 1, 3)
    );

    expect(entries.length).toBe(2);
    expect(entries[0]).toEqual(expect.objectContaining({
      artist: 'artist',
      title: 'title2'
    }));

    expect(entries[1]).toEqual(expect.objectContaining({
      artist: 'artist2',
      title: 'title'
    }));
  });

});
