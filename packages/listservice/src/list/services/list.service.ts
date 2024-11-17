import { Injectable, NotFoundException, ConflictException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { List } from 'shared-lib';
import { Board } from 'shared-lib';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CreateListDto } from '../dto/create-list.dto';

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
}
