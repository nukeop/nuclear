import { inject, injectable } from 'inversify';
import { ListeningHistoryRequest } from '../../controllers/listening-history';
import ListeningHistoryDb from './db';

@injectable()
class ListeningHistoryService {
  constructor(
    @inject(ListeningHistoryDb) private db: ListeningHistoryDb
  ) {  }
    
  postListeningHistoryEntry(entry: { artist: string; title: string; }) {
    return this.db.postEntry(entry.artist, entry.title);
  }

  getListeningHistory(request: ListeningHistoryRequest) {
    return this.db.getEntries(request);
  }

  clearListeningHistory() {
    return this.db.deleteEntries({});
  }
}

export default ListeningHistoryService;
