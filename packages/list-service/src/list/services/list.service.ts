import { Injectable, NotFoundException, ConflictException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { List } from 'shared-lib';
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
}
