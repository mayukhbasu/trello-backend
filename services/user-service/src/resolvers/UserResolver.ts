import { Resolver, Query } from 'type-graphql';
import { User } from '../models/User';

@Resolver()
export class UserResolver {
  @Query(() => User)
  helloUser(): User {
    return { id: "1", name: "Hello, Board!" };
  }
}
