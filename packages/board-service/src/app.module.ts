// app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Board } from 'shared-lib';
import { User } from 'shared-lib';
import { BoardModule } from './board/board.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Board, User],
      synchronize: true,
      autoLoadEntities: true, // Ensure this is set to true
    }),
    BoardModule
  ],
})
export class AppModule {}
