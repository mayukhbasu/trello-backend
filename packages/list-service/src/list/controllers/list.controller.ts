import { Controller, Post, Body, Param, Get, UseGuards, Patch } from '@nestjs/common';
import { ListService } from '../services/list.service';
import { CreateListDto } from '../dto/create-list.dto';
import { JwtAuthGuard, List } from 'shared-lib';
import { UpdateListDto } from '../dto/update-list.dto';

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

  @UseGuards(JwtAuthGuard)
  @Patch(':listId')
  async updateList(
    @Param('listId') listId: string,
    @Body() updateListDto: UpdateListDto,
  ): Promise<List> {
    return await this.listService.updateList(listId, updateListDto);
  }
}
