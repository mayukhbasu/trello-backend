import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
  Index,
} from 'typeorm';
import { List } from './list.entity';
import { Card } from './card.entity';
import { User } from './user.entity';

@Entity('board')
export class Board {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => List, (list) => list.board, { cascade: true })
  lists: List[];

  @OneToMany(() => Card, (card) => card.board, { cascade: true })
  cards: Card[];

  @Column({ default: 'private' })
  visibility: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'owner_id' })
  @Index('idx_board_owner', { unique: false })
  owner: User;

  // Adding a many-to-many relationship for collaborators
  @ManyToMany(() => User, { eager: true })
  @JoinTable({
    name: 'board_collaborators', // Custom join table name
    joinColumn: {
      name: 'board_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
  })
  collaborators: User[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
