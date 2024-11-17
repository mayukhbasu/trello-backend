import { BoardService } from '../services/board.service';
import { CreateBoardDto } from '../dto/create-board.dto';
import { Board } from 'shared-lib';
import { UpdateBoardDto } from '../dto/update-board.dto';
import { UpdateVisibilityDto } from '../dto/update-visibility.dto';
export declare class BoardController {
    private readonly boardService;
    constructor(boardService: BoardService);
    createBoard(createBoardDto: CreateBoardDto, req: any): Promise<Board>;
    getAllBoards(req: any, page?: number, limit?: number, visibility?: string): Promise<{
        boards: Board[];
        totalCount: number;
    }>;
    updateBoard(boardId: string, updateBoardDto: UpdateBoardDto, req: any): Promise<Board>;
    deleteBoard(boardId: string, req: any): Promise<string>;
    addCollaborator(boardId: string, collaboratorId: string, role: string, req: any): Promise<Board>;
    deleteCollaborator(boardId: string, collaboratorId: string, req: any): Promise<Board>;
    changeVisibility(boardId: string, updateVisibilityDto: UpdateVisibilityDto, req: any): Promise<Board>;
}
