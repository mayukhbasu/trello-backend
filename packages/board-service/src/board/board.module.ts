import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { User } from 'shared-lib';
import { BoardController } from './controller/board.controller';
import { Board } from './entities/board.entity';
import { BoardService } from './services/board.service';

@Module({
  imports: [
    ConfigModule, // Use ConfigModule without forRoot (import it in AppModule)
    TypeOrmModule.forFeature([Board, User]), // Include the User entity here
  ],
  controllers: [BoardController],
  providers: [BoardService],
  exports: [BoardService],
})
export class BoardModule {}
