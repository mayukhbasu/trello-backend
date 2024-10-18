import { Arg, Resolver } from "type-graphql";
import { User, UserModel } from "../models/User";

@Resolver()
export class UserResolver {

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