import { Resolver, Query } from 'type-graphql';
import { Board } from '../models/Board';

@Resolver()
export class BoardResolver {
  @Query(() => Board)
  helloBoard(): Board {
    return { id: "1", name: "Hello, Board!" };
  }
}
