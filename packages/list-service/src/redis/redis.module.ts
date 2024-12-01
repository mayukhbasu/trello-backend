import { Module } from '@nestjs/common';
import Redis from 'ioredis';
import { redisConfig } from './redis.config';

@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        return new Redis(redisConfig);
      },
    },
  ],
  exports: ['REDIS_CLIENT'],
})
export class RedisModule {}
