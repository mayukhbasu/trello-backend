import { InjectRepository } from '@nestjs/typeorm';
import { Board } from '../entities/board.entity';
import { Repository } from 'typeorm';
import { ConflictException, ForbiddenException, Inject, NotFoundException } from '@nestjs/common';
import { CreateBoardDto } from '../dto/create-board.dto';
import { User } from 'shared-lib';
import { UpdateBoardDto } from '../dto/update-board.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';


export class BoardService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache
  ) {}

  async createBoard(createBoardDto: CreateBoardDto, user: User): Promise<Board> {
    const { name, description, visibility = 'private' } = createBoardDto;

    // Ensure 'user' has a valid 'id'
    if (!user || !user.id) {
      throw new NotFoundException('User not found');
    }

    // Check if a board with the same name already exists for this user
    const existingBoard = await this.boardRepository.findOne({
      where: {
        name,
        owner: { id: user.id }, // Correctly reference 'id' as a mandatory field
      },
      relations: ['owner'],
    });

    if (existingBoard) {
      throw new ConflictException('A board with this name already exists.');
    }

    // Create a new board instance
    const board = this.boardRepository.create({
      name,
      description,
      visibility,
      owner: user,
    });

    // Ensure the 'board' object has valid values before saving
    if (!board.name || !board.owner || !board.visibility) {
      throw new Error('Invalid board data. Please check the input values.');
    }

    // Save the new board and return it
    return await this.boardRepository.save(board);
  }

  async getAllBoards(
    userId: string,
    page: number,
    limit: number,
    visibility?: string
  ): Promise<{boards: Board[], totalCount: number}> {
    const cacheKey = `boards:${userId}:page:${page}:limit:${limit}:visibility:${visibility || 'all'}`;
    const cachedData = await this.cacheManager.get<{ boards: Board[]; totalCount: number }>(cacheKey);
    if(cachedData) {
      return cachedData;
    }
    const query = this.boardRepository.createQueryBuilder('board')
                  .where('board.owner_id = :userId', {userId})
                  .skip((page - 1) * limit).take(limit);
    if(visibility) {
      query.andWhere('board.visibility = :visibility', { visibility });
    }
    const [boards, totalCount] = await query.getManyAndCount();
    const result = { boards, totalCount };
    await this.cacheManager.set(cacheKey, result, 300);
    return { boards, totalCount };
  }

  async updateBoard(boardId: string, updateBoardDto: UpdateBoardDto, userId: string): Promise<Board> {
    const board = await this.boardRepository.findOne({
      where: { id: boardId },
      relations: ['owner'],
    });

    if (!board) {
      throw new NotFoundException('Board not found.');
    }

    if (board.owner.id !== userId) {
      throw new ForbiddenException('You do not have permission to update this board.');
    }

    // Check for unique board name if it's being updated
    if (updateBoardDto.name && updateBoardDto.name !== board.name) {
      const existingBoard = await this.boardRepository.findOne({
        where: { name: updateBoardDto.name, owner: { id: userId } },
      });

      if (existingBoard) {
        throw new ConflictException('A board with this name already exists.');
      }
    }

    // Update board details
    Object.assign(board, updateBoardDto);

    return this.boardRepository.save(board);
  }

  async deleteBoard(boardId: string, user: User): Promise<string> {
    // Find the board by ID
    const board = await this.boardRepository.findOne({
      where: { id: boardId, owner: { id: user.id } },
    });

    // Check if the board exists
    if (!board) {
      throw new NotFoundException('Board not found.');
    }

    // Ensure the user is the owner of the board
    if (board.owner.id !== user.id) {
      throw new ForbiddenException('You are not authorized to delete this board.');
    }

    // Soft delete the board
    await this.boardRepository.softRemove(board);

    return `Board with ID ${boardId} has been successfully deleted.`;
  }
}
