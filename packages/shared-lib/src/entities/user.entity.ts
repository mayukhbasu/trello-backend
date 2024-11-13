// packages/shared-lib/src/entities/user.entity.ts

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ type: 'varchar', unique: true })
  username?: string;

  @Column({ type: 'varchar', unique: true })
  email?: string;

  @Column({ type: 'varchar' })
  password?: string;

  @Column({ type: 'simple-array', nullable: true })
  roles?: string[];
}
