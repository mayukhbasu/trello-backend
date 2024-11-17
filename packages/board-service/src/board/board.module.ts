import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-ioredis';

import { User } from 'shared-lib';
import { BoardController } from './controller/board.controller';
import { Board } from 'shared-lib';
import { BoardService } from './services/board.service';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Board, User]),
    CacheModule.register({
      store: redisStore as any, // Cast to `any` to avoid TypeScript issues
      host: 'localhost',
      port: 6379,
      ttl: 300, // Time to live (in seconds)
    }),
  ],
  controllers: [BoardController],
  providers: [BoardService],
  exports: [BoardService],
})
export class BoardModule {}
