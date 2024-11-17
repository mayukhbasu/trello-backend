import { Controller, Post, Body, Param, Get, UseGuards } from '@nestjs/common';
import { ListService } from '../services/list.service';
import { CreateListDto } from '../dto/create-list.dto';
import { JwtAuthGuard, List } from 'shared-lib';

@Controller('boards/:boardId/lists')
@UseGuards(JwtAuthGuard)
export class ListController {
  constructor(private readonly listService: ListService) {}

  @Post()
  async createList(
    @Param('boardId') boardId: string,
    @Body() createListDto: CreateListDto,
  ): Promise<List> {
    return this.listService.createList(boardId, createListDto);
  }

  @Get()
  async getListsForBoard(@Param('boardId') boardId: string): Promise<List[]> {
    return this.listService.getListsForBoard(boardId);
  }
}
