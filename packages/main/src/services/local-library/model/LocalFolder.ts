import { Entity, OneToMany, PrimaryColumn } from 'typeorm';

import LocalTrack from './LocalTrack';

@Entity()
class LocalFolder {
  @PrimaryColumn()
  path: string;

  @OneToMany(() => LocalTrack, track => track.folder)
  tracks: LocalTrack[];
}

export default LocalFolder;
