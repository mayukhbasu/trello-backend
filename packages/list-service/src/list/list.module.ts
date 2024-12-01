import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-ioredis';
import { ListService } from './services/list.service';
import { ListController } from './controllers/list.controller';
import { RedisModule } from '../redis/redis.module';
import { List, Board, Card, User } from 'shared-lib';
import { ListEventsService } from './events/list.events.service';
import { ListGateway } from './events/list.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([List, Board, Card, User]),
    CacheModule.register({
      store: redisStore as any,
      host: 'localhost',
      port: 6379,
      ttl: 300,
    }),
    RedisModule, // Import the Redis module
  ],
  controllers: [ListController],
  providers: [
    ListService,
    ListGateway,
    ListEventsService, // Use RedisPubSubService provided by RedisModule
  ],
})
export class ListModule {}
