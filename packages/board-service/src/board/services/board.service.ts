import { InjectRepository } from '@nestjs/typeorm';
import { Board } from '../entities/board.entity';
import { Repository } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { CreateBoardDto } from '../dto/create-board.dto';
import { User } from 'shared-lib';

export class BoardService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
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
}
