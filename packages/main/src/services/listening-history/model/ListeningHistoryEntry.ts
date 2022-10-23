import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ListeningHistoryEntry {
    @PrimaryGeneratedColumn("uuid")
    uuid: string;

    @Column()
    artist: string;

    @Column()
    title: string;

    @CreateDateColumn()
    createdAt: Date;
}
