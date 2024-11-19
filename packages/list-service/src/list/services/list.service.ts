import { Injectable, NotFoundException, ConflictException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activity, Card, List } from 'shared-lib';
import { Board } from 'shared-lib';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CreateListDto } from '../dto/create-list.dto';
import { UpdateListDto } from '../dto/update-list.dto';

@Injectable()
export class ListService {
  constructor(
    @InjectRepository(List)
    private readonly listRepository: Repository<List>,
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async createList(boardId: string, createListDto: CreateListDto): Promise<List> {
    const {name, description} = createListDto;
    const board = await this.boardRepository.findOne({where: {id: boardId}});
    if (!board) {
      throw new NotFoundException('Board not found.');
    }
    const existingList = await this.listRepository.findOne({
      where: {name, board: {id: boardId}}
    });
    if (existingList) {
      throw new ConflictException('A list with this name already exists for this board.');
    }
    const list = this.listRepository.create({
      name, description, board
    });
    const savedList = await this.listRepository.save(list);
    const cacheKey = `lists:${boardId}`;
    await this.cacheManager.del(cacheKey);
    await this.logActivity(savedList.id, boardId, 'CREATE', `List created with name: ${name}`);
    return savedList;
  }

  async getListsForBoard(boardId: string): Promise<List[]> {
    const cacheKey = `lists:${boardId}`;

    // Check cache first
    const cachedLists = await this.cacheManager.get<List[]>(cacheKey);
    if (cachedLists) {
      return cachedLists;
    }

    // Fetch lists from the database
    const lists = await this.listRepository.find({ where: { board: { id: boardId } } });

    // Cache the result
    await this.cacheManager.set(cacheKey, lists, 300);

    return lists;
  }

  async updateList(listId: string, updateListDto: UpdateListDto): Promise<List> {
    const cacheKey = `list:${listId}`;

    // Check the cache first
    let list = await this.cacheManager.get<List>(cacheKey);

    if (!list) {
      // Fetch the list from the database
      list = await this.listRepository.findOne({
        where: { id: listId },
        relations: ['board'],
      });

      if (!list) {
        throw new NotFoundException('List not found.');
      }

      // Cache the fetched list
      await this.cacheManager.set(cacheKey, list, 300);
    }

    // Check if the list name is being updated and enforce uniqueness
    if (updateListDto.name && updateListDto.name !== list.name) {
      const existingList = await this.listRepository.findOne({
        where: { name: updateListDto.name, board: { id: list.board.id } },
      });

      if (existingList) {
        throw new ConflictException('A list with this name already exists within the board.');
      }
    }

    // Update the list details
    Object.assign(list, updateListDto);

    // Save the updated list
    const updatedList = await this.listRepository.save(list);

    // Update the cache
    await this.cacheManager.set(cacheKey, updatedList, 300);

    return updatedList;
  }

  async deleteList(listId: string): Promise<string> {
    const cacheKey = `list:${listId}`;

    // Check the cache first
    let list = await this.cacheManager.get<List>(cacheKey);

    if (!list) {
      // Fetch the list from the database
      list = await this.listRepository.findOne({
        where: { id: listId },
      });

      if (!list) {
        throw new NotFoundException('List not found.');
      }
    }

    // Perform a soft delete
    await this.listRepository.softRemove(list);

    // Remove the list from cache
    await this.cacheManager.del(cacheKey);

    return `List with ID ${listId} has been successfully deleted.`;
  }

  async moveList(listId: string, targetBoardId: string): Promise<List> {
    const cacheKey = `list:${listId}`;
    let list = await this.cacheManager.get<List>(cacheKey);
    if(!list) {
      list = await this.listRepository.findOne({
        where: {id: listId},
        relations: ['board', 'cards']
      })
    }
    if(!list) {
      throw new NotFoundException('List not found.');
    }

    const targetBoard = await this.boardRepository.findOne({
      where: {id: targetBoardId}
    });
    if (!targetBoard) {
      throw new NotFoundException('Target board not found.');
    }
    if(list.board.id === targetBoardId) {
      throw new ConflictException('List is already in the target board.');
    }
    list.board = targetBoard;
    const cards = list.cards;
    if(cards && cards.length > 0) {
      for(const card of cards) {
        card.board = targetBoard;
        await this.cardRepository.save(card);
      }
    }

    const updatedList = await this.listRepository.save(list);
    await this.cacheManager.set(cacheKey, updatedList, 300);

    return updatedList;
  }

  async bulkUpdateLists(updateData: Array<{ id: string; name?: string; description?: string; archived?: boolean }>): Promise<List[]> {
    const updatedLists: List[] = [];

    for (const data of updateData) {
      const { id, name, description, archived } = data;
      const cacheKey = `list:${id}`;

      // Fetch the list from cache or database
      let list = await this.cacheManager.get<List>(cacheKey);
      if (!list) {
        list = await this.listRepository.findOne({ where: { id } });
        if (!list) {
          throw new NotFoundException(`List with ID ${id} not found.`);
        }
      }

      // Validate and update properties
      if (name && name !== list.name) {
        // Check for unique list name within the same board
        const existingList = await this.listRepository.findOne({
          where: { name, board: { id: list.board.id } },
        });
        if (existingList) {
          throw new ConflictException(`A list with the name '${name}' already exists within the board.`);
        }
        list.name = name;
      }

      if (description !== undefined) {
        list.description = description;
      }

      if (archived !== undefined) {
        list.archived = archived;
      }

      // Save the updated list
      const updatedList = await this.listRepository.save(list);
      updatedLists.push(updatedList);

      // Update the cache
      await this.cacheManager.set(cacheKey, updatedList, 300);
    }

    return updatedLists;
  }

  async logActivity(listId: string, userId: string, action: string, details?: string) {
    const activity = this.activityRepository.create({
      list: { id: listId },
      user: { id: userId },
      action,
      details,
    });
    await this.activityRepository.save(activity);
  }

}
