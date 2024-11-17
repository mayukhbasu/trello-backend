import { Board } from "./board.entity";
import { List } from "./list.entity";
export declare class Card {
    id: string;
    title: string;
    description: string;
    list: List;
    board: Board;
    archived: boolean;
    createdAt: Date;
    updatedAt: Date;
}
