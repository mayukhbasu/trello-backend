import 'reflect-metadata';
import { ApolloServer } from 'apollo-server';
import { buildSchema } from 'type-graphql';
import { BoardResolver } from './resolvers/BoardResolver';

async function startServer() {
  const schema = await buildSchema({
    resolvers: [BoardResolver],
  });

  const server = new ApolloServer({ schema });
  const port = process.env.PORT || 4002;
  server.listen({ port}).then(({ url }) => {
    console.log(`🚀 Board Service ready at ${url}`);
  });
}

startServer();
