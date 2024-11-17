import { InjectRepository } from '@nestjs/typeorm';
import { Board } from 'shared-lib';
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
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache
  ) {}

  async createBoard(createBoardDto: CreateBoardDto, user: User): Promise<Board> {
    const { name, description, visibility = 'private' } = createBoardDto;

    if (!user || !user.id) {
      throw new NotFoundException('User not found');
    }

    const cacheKey = `user:${user.id}:board:${name}`;
    const cachedBoard = await this.cacheManager.get<Board>(cacheKey);
    if (cachedBoard) {
      return cachedBoard;
    }

    const existingBoard = await this.boardRepository.findOne({
      where: { name, owner: { id: user.id } },
      relations: ['owner'],
    });

    if (existingBoard) {
      throw new ConflictException('A board with this name already exists.');
    }

    const board = this.boardRepository.create({
      name,
      description,
      visibility,
      owner: user,
    });

    const savedBoard = await this.boardRepository.save(board);

    // Cache the newly created board
    await this.cacheManager.set(cacheKey, savedBoard, 300);
    return savedBoard;
  }

  async getAllBoards(
    userId: string,
    page: number,
    limit: number,
    visibility?: string
  ): Promise<{ boards: Board[]; totalCount: number }> {
    const cacheKey = `boards:${userId}:page:${page}:limit:${limit}:visibility:${visibility || 'all'}`;
    const cachedData = await this.cacheManager.get<{ boards: Board[]; totalCount: number }>(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    const query = this.boardRepository.createQueryBuilder('board')
      .where('board.owner_id = :userId', { userId })
      .skip((page - 1) * limit)
      .take(limit);

    if (visibility) {
      query.andWhere('board.visibility = :visibility', { visibility });
    }

    const [boards, totalCount] = await query.getManyAndCount();
    const result = { boards, totalCount };

    // Cache the result
    await this.cacheManager.set(cacheKey, result, 300);
    return result;
  }

  async updateBoard(boardId: string, updateBoardDto: UpdateBoardDto, userId: string): Promise<Board> {
    const cacheKey = `board:${boardId}`;
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

    if (updateBoardDto.name && updateBoardDto.name !== board.name) {
      const existingBoard = await this.boardRepository.findOne({
        where: { name: updateBoardDto.name, owner: { id: userId } },
      });

      if (existingBoard) {
        throw new ConflictException('A board with this name already exists.');
      }
    }

    Object.assign(board, updateBoardDto);
    const updatedBoard = await this.boardRepository.save(board);

    // Update the cache
    await this.cacheManager.set(cacheKey, updatedBoard, 300);
    return updatedBoard;
  }

  async deleteBoard(boardId: string, user: User): Promise<string> {
    const board = await this.boardRepository.findOne({
      where: { id: boardId, owner: { id: user.id } },
    });

    if (!board) {
      throw new NotFoundException('Board not found.');
    }

    if (board.owner.id !== user.id) {
      throw new ForbiddenException('You are not authorized to delete this board.');
    }

    await this.boardRepository.softRemove(board);

    // Invalidate the cache
    const cacheKey = `board:${boardId}`;
    await this.cacheManager.del(cacheKey);

    return `Board with ID ${boardId} has been successfully deleted.`;
  }
  async addCollaborator(
    boardId: string,
    userId: string,
    collaboratorId: string,
    role: string
  ): Promise<Board> {
    const cacheKey = `board:${boardId}:collaborators`;
  
    // Check if the board exists in cache
    let board = await this.cacheManager.get<Board>(`board:${boardId}`);
  
    // If not in cache, fetch from the database
    if (!board) {
      board = await this.boardRepository.findOne({
        where: { id: boardId },
        relations: ['owner', 'collaborators'],
      });
  
      if (!board) {
        throw new NotFoundException('Board not found.');
      }
  
      // Cache the board data
      await this.cacheManager.set(`board:${boardId}`, board, 300);
    }
  
    // Ensure the user making the request is the board owner
    if (board.owner.id !== userId) {
      throw new ForbiddenException('You do not have permission to add collaborators.');
    }
  
    // Check if the collaborator already exists
    const collaboratorExists = board.collaborators.some(
      (user) => user.id === collaboratorId
    );
  
    if (collaboratorExists) {
      throw new ConflictException('User is already a collaborator.');
    }
  
    // Fetch the collaborator from the database
    const collaborator = await this.userRepository.findOne({
      where: { id: collaboratorId },
    });
  
    if (!collaborator) {
      throw new NotFoundException('Collaborator user not found.');
    }
  
    // Add the collaborator to the list
    board.collaborators.push(collaborator);
  
    // Save the updated board and cache the collaborators
    const updatedBoard = await this.boardRepository.save(board);
    await this.cacheManager.set(cacheKey, updatedBoard.collaborators, 300);
  
    return updatedBoard;
  }
  
  async removeCollaborator(
    boardId: string,
    userId: string,
    collaboratorId: string
  ): Promise<Board> {
    const cacheKey = `board:${boardId}`;
  
    // Check if the board data is in the cache
    let board = await this.cacheManager.get<Board>(cacheKey);
  
    // If not cached, fetch from the database
    if (!board) {
      board = await this.boardRepository.findOne({
        where: { id: boardId },
        relations: ['owner', 'collaborators'],
      });
  
      if (!board) {
        throw new NotFoundException('Board not found.');
      }
  
      // Store the board data in the cache
      await this.cacheManager.set(cacheKey, board, 300);
    }
  
    // Ensure the user making the request is the board owner
    if (board.owner.id !== userId) {
      throw new ForbiddenException('You do not have permission to remove collaborators.');
    }
  
    // Find the collaborator index
    const collaboratorIndex = board.collaborators.findIndex((user) => user.id === collaboratorId);
    if (collaboratorIndex === -1) {
      throw new NotFoundException('Collaborator not found on this board.');
    }
  
    // Remove the collaborator from the list
    board.collaborators.splice(collaboratorIndex, 1);
  
    // Save the updated board to the database
    const updatedBoard = await this.boardRepository.save(board);
  
    // Update the cache with the updated collaborator list
    await this.cacheManager.set(cacheKey, updatedBoard, 300);
  
    return updatedBoard;
  }
  
  async changeVisibility(
    boardId: string,
    userId: string,
    visibility: 'public' | 'private'
  ): Promise<Board> {
    const cacheKey = `board:${boardId}`;
  
    // Check if the board data is in the cache
    let board = await this.cacheManager.get<Board>(cacheKey);
  
    // If not cached, fetch from the database
    if (!board) {
      board = await this.boardRepository.findOne({
        where: { id: boardId },
        relations: ['owner'],
      });
  
      if (!board) {
        throw new NotFoundException('Board not found.');
      }
  
      // Store the board data in the cache
      await this.cacheManager.set(cacheKey, board, 300);
    }
  
    // Ensure the user is the owner of the board
    if (board.owner.id !== userId) {
      throw new ForbiddenException('You do not have permission to change the visibility of this board.');
    }
  
    // Update the visibility
    board.visibility = visibility;
  
    // Save the updated board to the database
    const updatedBoard = await this.boardRepository.save(board);
  
    // Update the cache with the new visibility
    await this.cacheManager.set(cacheKey, updatedBoard, 300);
  
    return updatedBoard;
  }
  
}
