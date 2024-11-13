// src/controllers/board.controller.ts

import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { BoardService } from '../services/board.service';
import { CreateBoardDto } from '../dto/create-board.dto';
import { Board } from '../entities/board.entity';
import { JwtAuthGuard } from 'shared-lib';


@Controller('boards')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createBoard(
    @Body() createBoardDto: CreateBoardDto,
    @Request() req
  ): Promise<Board> {
    const user = req.user;
    return this.boardService.createBoard(createBoardDto, user);
  }
  @Get("/")
  async testData() {
    return "Hello world";
  }
}
