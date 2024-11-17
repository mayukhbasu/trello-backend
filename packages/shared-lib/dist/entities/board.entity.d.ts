import { List } from './list.entity';
import { Card } from './card.entity';
import { User } from './user.entity';
export declare class Board {
    id: string;
    name: string;
    description: string;
    lists: List[];
    cards: Card[];
    visibility: string;
    owner: User;
    collaborators: User[];
    createdAt: Date;
    updatedAt: Date;
}
