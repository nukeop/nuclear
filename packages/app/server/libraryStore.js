import path from 'path';
import lowdb from 'lowdb';
import FileAsync from 'lowdb/adapters/FileAsync';
import electron from 'electron';

const defaultCwd = (electron.app || electron.remote.app).getPath('userData');
const defaultFilename = 'nuclear-local-library.json';
const adapter = new FileAsync(path.join(defaultCwd, defaultFilename));

export async function initDb() {
    const db = await lowdb(adapter);
    await db.defaults({
        localMeta: {},
        localFolders: []
    }).write();
    return db;
}