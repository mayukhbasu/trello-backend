// src/controllers/board.controller.ts

import { Controller, Post, Body, UseGuards, Request, Get, Query, Param, Put, Delete, Patch, Req } from '@nestjs/common';
import { BoardService } from '../services/board.service';
import { CreateBoardDto } from '../dto/create-board.dto';
import { Board } from 'shared-lib';
import { JwtAuthGuard } from 'shared-lib';
import { UpdateBoardDto } from '../dto/update-board.dto';
import { UpdateVisibilityDto } from '../dto/update-visibility.dto';


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

  @Delete(':boardId')
  @UseGuards(JwtAuthGuard)
  async deleteBoard(
    @Param('boardId') boardId: string,
    @Request() req
  ): Promise<string> {
    const user = req.user;
    return this.boardService.deleteBoard(boardId, user);
  }
  @Post('/:boardId/collaborators')
  @UseGuards(JwtAuthGuard)
  async addCollaborator(
    @Param('boardId') boardId: string,
    @Body('collaboratorId') collaboratorId: string,
    @Body('role') role: string,
    @Request() req,
  ) {
    const userId = req.user.id;
    return this.boardService.addCollaborator(boardId, userId, collaboratorId, role);
  }

  @Delete('/:boardId/collaborators')
  @UseGuards(JwtAuthGuard)
  async deleteCollaborator(
    @Param('boardId') boardId: string,
    @Body('collaboratorId') collaboratorId: string,
    @Body('role') role: string,
    @Request() req,
  ) {
    const userId = req.user.id;
    return this.boardService.deleteCollaborator(boardId, userId, collaboratorId, role);
  }

  @Patch(':boardId/visibility')
  @UseGuards(JwtAuthGuard)
  async changeVisibility(
    @Param('boardId') boardId: string,
    @Body() updateVisibilityDto: UpdateVisibilityDto,
    @Req() req: any
  ) {
    const userId = req.user.id;
    return await this.boardService.changeVisibility(boardId, userId, updateVisibilityDto.visibility);
  }
}
