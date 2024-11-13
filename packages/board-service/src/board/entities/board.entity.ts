// src/entities/board.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from 'shared-lib'; // Import User from the shared library

@Entity()
export class Board {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', default: 'private' })
  visibility: 'private' | 'public';

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User)
  owner: User;
}
