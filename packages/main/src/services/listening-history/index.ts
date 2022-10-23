import { inject, injectable } from 'inversify';
import ListeningHistoryDb from './db';

@injectable()
class ListeningHistory {
  
  constructor(
    @inject(ListeningHistoryDb) private db: ListeningHistoryDb
  ) {
        
  }
}
