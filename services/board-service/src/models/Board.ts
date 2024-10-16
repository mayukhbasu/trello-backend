import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
export class Board {

  @Field(() => ID)
  id: string

  @Field()
  name: string
}