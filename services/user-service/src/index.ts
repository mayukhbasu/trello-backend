import 'reflect-metadata';
import { ApolloServer } from 'apollo-server';
import { buildSchema } from 'type-graphql';
import { UserResolver } from './resolvers/UserResolver';

async function startServer() {
  const schema = await buildSchema({
    resolvers: [UserResolver],
  });

  const server = new ApolloServer({ schema });
  const port = process.env.PORT || 4001;
  server.listen({ port}).then(({ url }) => {
    console.log(`🚀 Board Service ready at ${url}`);
  });
}

startServer();
