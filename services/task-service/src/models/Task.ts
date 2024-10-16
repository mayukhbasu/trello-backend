import { ObjectType, Field, ID } from 'type-graphql';

@ObjectType()
export class Task {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;
}
