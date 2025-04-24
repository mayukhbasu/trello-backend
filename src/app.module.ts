// src/app.module.ts
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { UrlModule } from './url/url.module';
import * as redisStore from 'cache-manager-ioredis';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: 'localhost',
      port: 6379,
      ttl: 60 * 60, // 1 hour TTL
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'myuser',
      password: 'mypassword',
      database: 'shortener',
      autoLoadEntities: true,
      synchronize: true,
    }),
    UrlModule,
  ],
})
export class AppModule {}
