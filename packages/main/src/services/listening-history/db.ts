import { app } from 'electron';
import { inject, injectable } from 'inversify';
import { Between, Connection, createConnection, FindOneOptions, LessThan, MoreThan, Repository } from 'typeorm';
import path from 'path';

import Config from '../config';
import { $mainLogger, ILogger } from '../logger';
import { ListeningHistoryEntry } from './model/ListeningHistoryEntry';

type ListeningHistoryFilters = {
  artist?: string;
  title?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

@injectable()
class ListeningHistoryDb{
    private connection: Connection;
    private listeningHistoryRepository: Repository<ListeningHistoryEntry>;

    constructor(
        @inject($mainLogger) private logger: ILogger,
        @inject(Config) private config: Config
    ) {}

    async connect() {
      try {
        const database = path.join(app.getPath('userData'), this.config.listeningHistoryDbName);

        this.connection = await createConnection({
          type: 'sqlite',
          name: 'listening-history',
          database,
          entities: [ListeningHistoryEntry],
          synchronize: true,
          logging: false
        });
        
        this.listeningHistoryRepository = this.connection.getRepository<ListeningHistoryEntry>(ListeningHistoryEntry);

        this.logger.log(`Listening history database created at ${database}`);
      } catch (e) {
        console.error(e);
        this.logger.error('Could not connect to the sqlite database for listening history');
        this.logger.error(e.stack);
      }
    }

    async postEntry(artist: string, title: string) {
      
      return this.listeningHistoryRepository.save({
        artist,
        title
      });
    }

    async getEntries(): Promise<ListeningHistoryEntry[]> {
      return this.listeningHistoryRepository.find();
    }

    async getEntriesWithFilters(filters: ListeningHistoryFilters): Promise<ListeningHistoryEntry[]> {
      const where: FindOneOptions<ListeningHistoryEntry>['where'] = {};

      if (filters.artist) {
        where.artist = filters.artist;
      }

      if (filters.title) {
        where.title = filters.title;
      }

      if (filters.dateFrom && !filters.dateTo) {
        where.createdAt = MoreThan(filters.dateFrom);
      }

      if (filters.dateTo && !filters.dateFrom) {
        where.createdAt = LessThan(filters.dateTo);
      }

      if (filters.dateFrom && filters.dateTo) {
        where.createdAt = Between(filters.dateFrom, filters.dateTo);
      }

      return this.listeningHistoryRepository.find({ where });
    }

    async getEntriesForDates(from: Date, to: Date): Promise<ListeningHistoryEntry[]> {
      return this.listeningHistoryRepository.createQueryBuilder('entry')
        .where(`entry.createdAt BETWEEN '${from.toISOString()}' AND '${to.toISOString()}'`)
        .getMany();
    }

    async deleteEntriesWithFilters(filters: ListeningHistoryFilters): Promise<void> {
      const entries = await this.getEntriesWithFilters(filters);

      await this.listeningHistoryRepository.remove(entries);
    }

    async getRepository(): Promise<Repository<ListeningHistoryEntry>> {
      return this.listeningHistoryRepository;
    }
}

export default ListeningHistoryDb;
