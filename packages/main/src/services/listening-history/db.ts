import { app } from 'electron';
import { inject, injectable } from 'inversify';
import { DataSource, Repository, DataSourceOptions } from 'typeorm';
import path from 'path';
import fs from 'fs';

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
      if (this.connection?.isInitialized) {
        return;
      }

      try {
        const userDataPath = app.getPath('userData');
        this.logger.log(`User data path: ${userDataPath}`);
        
        const dbPath = path.normalize(path.join(userDataPath, this.config.listeningHistoryDbName));
        this.logger.log(`Database path: ${dbPath}`);
        
        const dbDir = path.dirname(dbPath);
        this.logger.log(`Database directory: ${dbDir}`);

        if (!fs.existsSync(dbDir)) {
          this.logger.log(`Creating database directory: ${dbDir}`);
          fs.mkdirSync(dbDir, { recursive: true });
        }

        if (!fs.existsSync(dbDir)) {
          throw new Error(`Failed to create database directory: ${dbDir}`);
        }

        try {
          fs.accessSync(dbDir, fs.constants.W_OK);
          this.logger.log(`Directory is writable: ${dbDir}`);
        } catch (e) {
          this.logger.error(`Directory is not writable: ${dbDir}`);
          throw e;
        }

        const dbConfig: DataSourceOptions = {
          type: 'sqlite',
          name: 'listening-history',
          database: this.config.listeningHistoryDbName === ':memory:' ? ':memory:' : dbPath,
          entities: [ListeningHistoryEntry],
          synchronize: true,
          logging: false
        };

        this.logger.log('Creating database connection with config:', dbConfig);
        this.connection = new DataSource(dbConfig);

        this.logger.log('Initializing database connection...');
        await this.connection.initialize();
        
        this.logger.log('Getting repository...');
        this.listeningHistoryRepository = this.connection.getRepository(ListeningHistoryEntry);

        if (!this.listeningHistoryRepository) {
          throw new Error('Failed to initialize listening history repository');
        }

        this.logger.log(`Listening history database initialized successfully at ${dbPath}`);
      } catch (e) {
        this.logger.error('Could not connect to the sqlite database for listening history');
        this.logger.error(`Error name: ${e.name}`);
        this.logger.error(`Error message: ${e.message}`);
        this.logger.error(`Error stack: ${e.stack}`);
        throw e;
      }
    }

    async postEntry(artist: string, title: string) {
      return this.listeningHistoryRepository.save({
        artist,
        title
      });
    }

    async getEntries(request?: ListeningHistoryRequest): Promise<PagingResult<ListeningHistoryEntry>> {
      if (!this.connection?.isInitialized || !this.listeningHistoryRepository) {
        throw new Error('Database connection not initialized');
      }

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

    async disconnect() {
      if (this.connection) {
        await this.connection.destroy();
      }
    }

    async getRepository(): Promise<Repository<ListeningHistoryEntry>> {
      return this.listeningHistoryRepository;
    }
}

export default ListeningHistoryDb;
