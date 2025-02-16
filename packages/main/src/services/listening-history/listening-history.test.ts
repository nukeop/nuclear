import Config from '../config';
import { TestLogger } from '../../../tests/test-logger';
import ListeningHistoryDb from './db';
import { range } from 'lodash';

describe('Listening history', () => {
  let Db: ListeningHistoryDb;
  
  beforeAll(async () => {
    jest.mock('electron', () => ({
      app: {
        getPath: jest.fn().mockImplementation(() => '')
      }
    }));

    Db = new ListeningHistoryDb(new TestLogger(), {
      listeningHistoryDbName: ':memory:'
    } as Config);
    
    await Db.connect();
  });

  beforeEach(async () => {
    await Db.deleteEntries({});
  });

  afterAll(async () => {
    await Db.disconnect();
  });

  it('should post an entry', async () => {
    const now = new Date();
    await Db.postEntry('artist', 'title');
    const entries = await Db.getEntries();
    expect(entries.data.length).toBe(1);
    expect(entries.data[0].artist).toBe('artist');
    expect(entries.data[0].title).toBe('title');
    expect(Math.abs(entries.data[0].createdAt.valueOf() - now.valueOf())).toBeLessThan(1000);
  });

  it('should get paginated entries (1st page)', async () => {
    const repository = await Db.getRepository();
    await Promise.all(range(20).map(async i => {
      const entry = await Db.postEntry(`artist${i}`, `title${i}`);
      await repository.update(entry.uuid, {
        createdAt: new Date(2019, 1, i + 1)
      });
    }));
    const entries = await Db.getEntries({ limit: 10 });

    expect(entries.data.length).toBe(10);
    expect(entries.data[0].createdAt).toEqual(new Date(2019, 1, 20));
    expect(entries.data[9].createdAt).toEqual(new Date(2019, 1, 11));
  });

  it('should get paginated entries (2nd page)', async () => {
    const repository = await Db.getRepository();
    await Promise.all(range(20).map(async i => {
      const entry = await Db.postEntry(`artist${i}`, `title${i}`);
      await repository.update(entry.uuid, {
        createdAt: new Date(2019, 1, i + 1)
      });
    }));
    let entries = await Db.getEntries({ limit: 10 });
    
    entries = await Db.getEntries({ limit: 10, afterCursor: entries.cursor.afterCursor });

    expect(entries.data.length).toBe(10);
    expect(entries.data[0].createdAt).toEqual(new Date(2019, 1, 11));
    expect(entries.data[9].createdAt).toEqual(new Date(2019, 1, 2));
  });  

  it('should get entries with filters', async () => {
    await Db.postEntry('artist', 'title');
    await Db.postEntry('artist', 'title2');
    await Db.postEntry('artist2', 'title');
    await Db.postEntry('artist2', 'title2');
    const entries = await Db.getEntries({
      artist: 'artist',
      title: 'title'
    });
    expect(entries.data.length).toBe(1);
    expect(entries.data[0].artist).toBe('artist');
    expect(entries.data[0].title).toBe('title');
  });

  it('should delete entries with filters', async () => {
    await Db.postEntry('artist', 'title');
    await Db.postEntry('artist', 'title2');
    await Db.postEntry('artist2', 'title');
    await Db.postEntry('artist2', 'title2');
    await Db.deleteEntries({
      artist: 'artist'
    });
    const entries = await Db.getEntries();
    expect(entries.data.length).toBe(2);
    expect(entries.data[0]).toEqual(expect.objectContaining({
      artist: 'artist2',
      title: 'title'
    }));
    expect(entries.data[1]).toEqual(expect.objectContaining({
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

    const entries = await Db.getEntries({
      dateFrom: new Date(2019, 1, 1), 
      dateTo: new Date(2019, 1, 3)
    });

    expect(entries.data.length).toBe(2);
    expect(entries.data[0]).toEqual(expect.objectContaining({
      artist: 'artist2',
      title: 'title'
    }));

    expect(entries.data[1]).toEqual(expect.objectContaining({
      artist: 'artist',
      title: 'title2'
    }));
  });
});
