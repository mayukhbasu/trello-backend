import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Url {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({unique: true})
  shortCode: string;

  @Column({unique: true})
  longUrl: string;

  @CreateDateColumn()
  createdAt: Date;
}