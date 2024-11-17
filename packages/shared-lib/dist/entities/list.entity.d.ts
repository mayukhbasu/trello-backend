import { Board } from "./board.entity";
import { Card } from "./card.entity";
export declare class List {
    id: string;
    name: string;
    description: string;
    board: Board;
    cards: Card[];
    archived: boolean;
    createdAt: Date;
    updatedAt: Date;
}
