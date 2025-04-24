// src/url/url.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Url {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  shortCode: string;

  @Column({ unique: true })
  longUrl: string;

  @Column({ unique: true })
  urlHash: string;

  @CreateDateColumn()
  createdAt: Date;
}
