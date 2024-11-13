import { Board } from "../entities/board.entity";
import { Repository } from "typeorm";
import { CreateBoardDto } from "../dto/create-board.dto";
import { User } from 'shared-lib';
export declare class BoardService {
    private readonly boardRepository;
    constructor(boardRepository: Repository<Board>);
    createBoard(createBoardDto: CreateBoardDto, user: User): Promise<Board>;
}
