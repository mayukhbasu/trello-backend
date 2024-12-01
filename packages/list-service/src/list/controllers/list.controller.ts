import { 
  Controller, 
  Post, 
  Body, 
  Param, 
  Get, 
  UseGuards, 
  Patch, 
  Delete, 
  HttpCode, 
  HttpStatus 
} from '@nestjs/common';
import { ListService } from '../services/list.service';
import { CreateListDto } from '../dto/create-list.dto';
import { JwtAuthGuard, List } from 'shared-lib';
import { UpdateListDto } from '../dto/update-list.dto';
import { ListEventsService } from '../events/list.events.service';

@Controller('boards/:boardId/lists')
@UseGuards(JwtAuthGuard)
export class ListController {
  constructor(
    private readonly listService: ListService,
    private readonly listEventsService: ListEventsService, // Inject ListEventsService
  ) {}

  @Post()
  async createList(
    @Param('boardId') boardId: string,
    @Body() createListDto: CreateListDto,
  ): Promise<List> {
    const list = await this.listService.createList(boardId, createListDto);

    // Emit WebSocket event
    this.listEventsService.emitEvent(boardId, 'list-created', list);

    return list;
  }

  @Get()
  async getListsForBoard(@Param('boardId') boardId: string): Promise<List[]> {
    return this.listService.getListsForBoard(boardId);
  }

  @Patch(':listId')
  async updateList(
    @Param('listId') listId: string,
    @Body() updateListDto: UpdateListDto,
  ): Promise<List> {
    const updatedList = await this.listService.updateList(listId, updateListDto);

    // Emit WebSocket event
    this.listEventsService.emitEvent(updatedList.board.id, 'list-updated', updatedList);

    return updatedList;
  }

  @Delete(':listId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteList(@Param('listId') listId: string): Promise<void> {
    const list = await this.listService.getListById(listId); // Fetch list to get boardId
    await this.listService.deleteList(listId);

    // Emit WebSocket event
    this.listEventsService.emitEvent(list.board.id, 'list-deleted', { id: listId });
  }

  @Patch(':listId/move')
  @HttpCode(HttpStatus.OK)
  async moveList(
    @Param('listId') listId: string,
    @Body('targetBoardId') targetBoardId: string,
  ) {
    const movedList = await this.listService.moveList(listId, targetBoardId);

    // Emit WebSocket events
    this.listEventsService.emitEvent(movedList.board.id, 'list-moved', movedList);
    this.listEventsService.emitEvent(targetBoardId, 'list-added', movedList);

    return movedList;
  }

  @Patch('bulk-update')
  @HttpCode(HttpStatus.OK)
  async bulkUpdateLists(
    @Body() updateData: Array<{ id: string; name?: string; description?: string; archived?: boolean }>,
  ) {
    const updatedLists = await this.listService.bulkUpdateLists(updateData);

    // Emit WebSocket event for each updated list
    updatedLists.forEach((list) => {
      this.listEventsService.emitEvent(list.board.id, 'list-updated', list);
    });

    return updatedLists;
  }
}
