import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { UserResolver } from './resolvers/UserResolver';
import { ApolloServer } from 'apollo-server';

async function startServer() {
  const schema = await buildSchema({
    resolvers: [UserResolver]
  });

  

  const server = new ApolloServer({schema});
  const port = process.env.PORT || 4000;
  server.listen({port}).then(({ url }) => {
    console.log(`🚀 User Service ready at ${url}`);
  });
}

startServer();