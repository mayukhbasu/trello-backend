// user.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([])],
  controllers: [],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
