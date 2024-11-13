// board.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from 'shared-lib';

@Entity()
export class Board {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: 'private' })
  visibility: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'owner_id', referencedColumnName: 'id' }) // Specify the referenced column explicitly
  owner: User;
}
