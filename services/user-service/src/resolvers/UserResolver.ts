import { Resolver, Query, Mutation, Arg } from 'type-graphql';
import { User } from '../models/User';
import { v4 as uuidv4 } from 'uuid';

@Resolver()
export class UserResolver {
  private users: User[] = []; // In-memory array to store users

  @Query(() => [User])
  async getUsers(): Promise<User[]> {
    return this.users;
  }

  @Mutation(() => User)
  async createUser(
    @Arg('name') name: string,
    @Arg('email') email: string
  ): Promise<User> {
    const user = {
      id: uuidv4(),
      name,
      email,
    };

    this.users.push(user);
    return user;
  }
}
