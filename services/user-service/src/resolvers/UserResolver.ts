import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { User, UserModel } from "../models/User";
import { IsEmail, Length } from 'class-validator';

@Resolver()
export class UserResolver {

  @Query(() => [User])
  async getUsers(): Promise<User[]> {
    try {
      return await UserModel.find(); // Fetch all users from the database
    } catch (err) {
      throw new Error('Error fetching users: ' + err);
    }
  }

  @Mutation(() => User)
  async saveUser(
    @Arg('name', () => String)  name: string, // Validate name length
    @Arg('email', () => String) email: string, // Validate email format
    @Arg('pictureUrl', { nullable: true }) pictureUrl: string
  ): Promise<User> {
    try {
      const userData: Partial<User> = { name, email };
      if (pictureUrl) {
        userData.pictureUrl = pictureUrl;
      }

      const user = await UserModel.findOneAndUpdate(
        { email }, 
        userData, 
        { upsert: true, new: true }
      );
      return user;
    } catch (err) {
      throw new Error('Failed to save user: ' + err);
    }
  }
}
