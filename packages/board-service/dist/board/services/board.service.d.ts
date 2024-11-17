import { Board } from 'shared-lib';
import { Repository } from 'typeorm';
import { CreateBoardDto } from '../dto/create-board.dto';
import { User } from 'shared-lib';
import { UpdateBoardDto } from '../dto/update-board.dto';
import { Cache } from 'cache-manager';
export declare class BoardService {
    private readonly boardRepository;
    private readonly userRepository;
    private readonly cacheManager;
    constructor(boardRepository: Repository<Board>, userRepository: Repository<User>, cacheManager: Cache);
    createBoard(createBoardDto: CreateBoardDto, user: User): Promise<Board>;
    getAllBoards(userId: string, page: number, limit: number, visibility?: string): Promise<{
        boards: Board[];
        totalCount: number;
    }>;
    updateBoard(boardId: string, updateBoardDto: UpdateBoardDto, userId: string): Promise<Board>;
    deleteBoard(boardId: string, user: User): Promise<string>;
    addCollaborator(boardId: string, userId: string, collaboratorId: string, role: string): Promise<Board>;
    deleteCollaborator(boardId: string, userId: string, collaboratorId: string, role: string): Promise<Board>;
    changeVisibility(boardId: string, userId: string, visibility: 'public' | 'private'): Promise<Board>;
}
