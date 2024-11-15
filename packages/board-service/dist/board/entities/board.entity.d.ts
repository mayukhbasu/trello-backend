import { User } from 'shared-lib';
export declare class Board {
    id: string;
    name: string;
    description: string;
    visibility: string;
    owner: User;
    deletedAt?: Date;
    collaborators: User[];
}
