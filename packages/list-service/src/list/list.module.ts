import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-ioredis';
import { ListService } from './services/list.service';
import { ListController } from './controllers/list.controller';
import { List, Board, Card, User } from 'shared-lib';

@Module({
  imports: [
    TypeOrmModule.forFeature([List, Board, Card, User]),
    CacheModule.register({
      store: redisStore as any,
      host: 'localhost',
      port: 6379,
      ttl: 300,
    }),
  ],
  controllers: [ListController],
  providers: [ListService],
})
export class ListModule {}
