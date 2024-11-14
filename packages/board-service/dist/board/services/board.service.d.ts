import { Board } from '../entities/board.entity';
import { Repository } from 'typeorm';
import { CreateBoardDto } from '../dto/create-board.dto';
import { User } from 'shared-lib';
import { UpdateBoardDto } from '../dto/update-board.dto';
export declare class BoardService {
    private readonly boardRepository;
    constructor(boardRepository: Repository<Board>);
    createBoard(createBoardDto: CreateBoardDto, user: User): Promise<Board>;
    getAllBoards(userId: string, page: number, limit: number, visibility?: string): Promise<{
        boards: Board[];
        totalCount: number;
    }>;
    updateBoard(boardId: string, updateBoardDto: UpdateBoardDto, userId: string): Promise<Board>;
}
