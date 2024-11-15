// board.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, DeleteDateColumn, Index } from 'typeorm';
import { User } from 'shared-lib';

@Entity()
@Index('idx_board_owner', ['owner']) // Index on 'owner' column
@Index('idx_board_name', ['name'])   // Index on 'name' column
export class Board {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: 'private' })
  visibility: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'owner_id', referencedColumnName: 'id' }) // Specify the referenced column explicitly
  owner: User;

  @DeleteDateColumn()
  deletedAt?: Date;
}
