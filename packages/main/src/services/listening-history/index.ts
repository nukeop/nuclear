import { inject, injectable } from 'inversify';
import ListeningHistoryDb from './db';

@injectable()
class ListeningHistoryService {
  constructor(
    @inject(ListeningHistoryDb) private db: ListeningHistoryDb
  ) {  }
    
  postListeningHistoryEntry(entry: { artist: string; title: string; }) {
    return this.db.postEntry(entry.artist, entry.title);
  }

  getListeningHistory() {
    return this.db.getEntries();
  }
}

export default ListeningHistoryService;
