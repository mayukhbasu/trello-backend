import { Resolver, Query } from 'type-graphql';
import { Task } from '../models/Task';

@Resolver()
export class TaskResolver {
  @Query(() => Task)
  helloTask(): Task {
    return { id: "1", title: "Hello, Task!" };
  }
}
