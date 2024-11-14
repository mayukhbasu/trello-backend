// src/controllers/board.controller.ts

import { Controller, Post, Body, UseGuards, Request, Get, Query, Param, Put } from '@nestjs/common';
import { BoardService } from '../services/board.service';
import { CreateBoardDto } from '../dto/create-board.dto';
import { Board } from '../entities/board.entity';
import { JwtAuthGuard } from 'shared-lib';
import { UpdateBoardDto } from '../dto/update-board.dto';


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
  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllBoards(
    @Request() req,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('visibility') visibility?: string,
  ) {
    const user = req.user;
    return this.boardService.getAllBoards(user.id, page, limit, visibility);
  }

  @Put(':boardId')
  @UseGuards(JwtAuthGuard)
  async updateBoard(
    @Param('boardId') boardId: string,
    @Body() updateBoardDto: UpdateBoardDto,
    @Request() req
  ): Promise<Board> {
    const userId = req.user.userId;
    return this.boardService.updateBoard(boardId, updateBoardDto, userId);
  }
}
