import { app } from 'electron';
import { inject, injectable } from 'inversify';
import { DataSource, Repository } from 'typeorm';
import path from 'path';

import Config from '../config';
import { $mainLogger, ILogger } from '../logger';
import { ListeningHistoryEntry } from './model/ListeningHistoryEntry';
import { ListeningHistoryRequest } from '../../controllers/listening-history';
import { buildPaginator, PagingResult } from 'typeorm-cursor-pagination';


@injectable()
class ListeningHistoryDb{
    private connection: DataSource;
    private listeningHistoryRepository: Repository<ListeningHistoryEntry>;

    constructor(
        @inject($mainLogger) private logger: ILogger,
        @inject(Config) private config: Config
    ) {}

    async connect() {
      try {
        const database = path.join(app.getPath('userData'), this.config.listeningHistoryDbName);

        this.connection = new DataSource({
          type: 'sqlite',
          name: 'listening-history',
          database,
          entities: [ListeningHistoryEntry],
          synchronize: true,
          logging: false
        });
        await this.connection.initialize();
        
        this.listeningHistoryRepository = this.connection.getRepository<ListeningHistoryEntry>(ListeningHistoryEntry);

        this.logger.log(`Listening history database created at ${database}`);
      } catch (e) {
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

    async getEntries(request?: ListeningHistoryRequest): Promise<PagingResult<ListeningHistoryEntry>> {
      const qb = this.listeningHistoryRepository.createQueryBuilder('entry');

      if (request?.artist) {
        qb.andWhere(`entry.artist = '${request.artist}'`);
      }

      if (request?.title) {
        qb.andWhere(`entry.title = '${request.title}'`);
      }

      if (request?.dateFrom && !request?.dateTo) {
        qb.andWhere(`entry.createdAt > '${request.dateFrom.toISOString()}'`);
      }

      if (request?.dateTo && !request?.dateFrom) {
        qb.andWhere(`entry.createdAt < '${request.dateTo.toISOString()}'`);
      }

      if (request?.dateFrom && request?.dateTo) {
        qb.andWhere(`entry.createdAt BETWEEN '${request.dateFrom.toISOString()}' AND '${request.dateTo.toISOString()}'`);
      }

      const paginator = buildPaginator({
        entity: ListeningHistoryEntry,
        alias: 'entry',
        paginationKeys: ['createdAt'],
        query: {
          limit: request?.limit,
          order: request?.order ?? 'DESC',
          beforeCursor: request?.beforeCursor,
          afterCursor: request?.afterCursor
        }
      });

      return paginator.paginate(qb);
    }

    async deleteEntries(request: ListeningHistoryRequest): Promise<void> {
      const entries = await this.getEntries(request);

      await this.listeningHistoryRepository.remove(entries.data);
    }

    async getRepository(): Promise<Repository<ListeningHistoryEntry>> {
      return this.listeningHistoryRepository;
    }
}

export default ListeningHistoryDb;
