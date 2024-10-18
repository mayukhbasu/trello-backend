// src/models/User.ts
import { prop, getModelForClass } from '@typegoose/typegoose';
import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export class User {
  @Field()
  @prop({ required: true })
  public name: string;

  @Field()
  @prop({ required: true, unique: true })
  public email: string;

  @Field()
  @prop()
  public pictureUrl?: string;
}

export const UserModel = getModelForClass(User);
