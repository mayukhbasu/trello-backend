import { InjectRepository } from "@nestjs/typeorm";
import { Board } from "../entities/board.entity";
import { Repository } from "typeorm";
import { ConflictException } from "@nestjs/common";
import { CreateBoardDto } from "../dto/create-board.dto";
import { User } from 'shared-lib';


export class BoardService {

  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>
  ){}

  async createBoard(createBoardDto: CreateBoardDto, user: User): Promise<Board> {
    const { name, description, visibility = 'private' } = createBoardDto;

    // Check if the board name already exists for the user
    const existingBoard = await this.boardRepository.findOne({
      where: { name, owner: user },
    });

    if (existingBoard) {
      throw new ConflictException('A board with this name already exists.');
    }

    // Create a new board
    const board = this.boardRepository.create({
      name,
      description,
      visibility,
      owner: user,
    });

    // Save the new board
    return this.boardRepository.save(board);
  }
}