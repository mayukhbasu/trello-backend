import { List } from './list.entity';
import { User } from './user.entity';
export declare class Activity {
    id: string;
    list: List;
    user: User;
    action: string;
    details: string;
    createdAt: Date;
}
