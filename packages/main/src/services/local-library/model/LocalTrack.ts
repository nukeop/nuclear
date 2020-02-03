import { NuclearStream } from '@nuclear/core';
import {Entity, PrimaryColumn, Column, ManyToOne, BeforeInsert, AfterLoad, AfterInsert, AfterRemove} from 'typeorm';
import fs from 'fs';
import { promisify } from 'util';
import path from 'path';
import { app } from 'electron';
import crypto from 'crypto';
import url from 'url';
import uuid from 'uuid/v4';

import { NuclearLocalMeta } from '../interfaces';
import LocalFolder from './LocalFolder';

const THUMBNAILS_DIR = path.join(app.getPath('userData'), 'thumbnails');

@Entity()
class LocalTrack implements NuclearLocalMeta {
  @PrimaryColumn()
  uuid: string;

  @Column({ nullable: true })
  album?: string;

  @Column()
  artist: string;

  @Column()
  duration?: number;

  @Column({ nullable: true })
  thumbnail?: string;

  @Column()
  name?: string;

  @Column({ unique: true })
  path: string;

  @Column({ nullable: true })
  pos?: number;

  @Column({ nullable: true })
  genrestr?: string;

  @Column({ nullable: true })
  year?: string;

  @ManyToOne(() => LocalFolder, folder => folder.path)
  folder: LocalFolder;

  imageData?: { data: Buffer; format: string };
  genre?: string[];
  local?: boolean;
  streams?: NuclearStream[];

  private async existCover(coverPath: string): Promise<string | undefined> {
    try {
      const { isFile } = await promisify(fs.stat)(coverPath);
      return isFile && coverPath;
    } catch (err) {
      return undefined;
    }
  }

  private hashThumbFilename(imageData: { format: string }) {
    return `${
      crypto.createHash('md5').update(path.basename(this.album || this.path)).digest('hex')
    }.${imageData.format.split('/')[1]}`;
  }

  @AfterInsert()
  @AfterLoad()
  nuclearMapper() {
    this.local = true;
    this.genre = this.genrestr && this.genrestr.split(',') || [];
    delete this.genrestr;

    this.streams = [
      {
        uuid: uuid(),
        title: this.name,
        duration: this.duration,
        source: 'Local',
        stream: url.format({
          pathname: this.path,
          protocol: 'file:',
          slashes: true
        })
      }
    ];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this as any).artist = {
      name: this.artist
    };
  }

  @BeforeInsert()
  async createThumbail() {
    this.genrestr = this.genre ? this.genre.join(',') : '';
    delete this.genre;
    if (this.imageData) {
      const thumbPath = path.resolve(
        THUMBNAILS_DIR,
        this.hashThumbFilename(this.imageData)
      );
      const existingThumb = await this.existCover(thumbPath);
  
      if (existingThumb) {
        this.thumbnail = existingThumb;
      } else {
        await promisify(fs.writeFile)(thumbPath, this.imageData.data);
      }
  
      delete this.imageData;
      this.thumbnail = url.format({
        pathname: thumbPath,
        protocol: 'file:',
        slashes: true
      });
    }
  }

  @AfterRemove() 
  async removeThumbnail() {
    try {
      if (this.thumbnail && await promisify(fs.access)(this.thumbnail, fs.constants.W_OK)) {
        await promisify(fs.unlink)(this.thumbnail);
      }
    } catch (err) {
      // do nothing
    }
  }
}

export default LocalTrack;
