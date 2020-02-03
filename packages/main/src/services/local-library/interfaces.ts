import { NuclearStream } from '@nuclear/core';
import LocalFolder from './model/LocalFolder';

export interface NuclearLocalMeta {
  uuid: string;
  duration?: number;
  path: string;
  name?: string;
  pos?: number;
  album?: string;
  artist?: string;
  genre?: string[];
  year?: string;
  loading?: boolean;
  local?: boolean;
  thumb?: string;
  streams?: NuclearStream[];
  folder?: LocalFolder;

  image?: Array<{ '#text': string } | undefined>;
  imageData?: { format: string; data: Buffer };
}
