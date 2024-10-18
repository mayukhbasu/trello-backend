import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { User, UserModel } from "../models/User";

@Resolver()
export class UserResolver {

  @Query(() => [User])
  async getUsers(): Promise<User[]> {
    return await UserModel.find(); // Fetch all users from the database
  }
  @Mutation(() => User)
  async saveUser(
    @Arg('name') name: string,
    @Arg('email') email: string,
    @Arg('pictureUrl', {nullable: true}) pictureUrl: string
  ): Promise<User> {
    let user = await UserModel.findOne({email});
    if(!user) {
      user = new UserModel({name, email, pictureUrl});
      await user.save();
      
    }
    return user;
  }
}