import { User } from 'shared-lib';
export declare class Board {
    id: string;
    name: string;
    description: string;
    visibility: 'private' | 'public';
    createdAt: Date;
    owner: User;
}
