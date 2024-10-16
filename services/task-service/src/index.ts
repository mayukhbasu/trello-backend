import 'reflect-metadata';
import { ApolloServer } from 'apollo-server';
import { buildSchema } from 'type-graphql';
import { TaskResolver } from './resolvers/TaskResolver';

async function startServer() {
  const schema = await buildSchema({
    resolvers: [TaskResolver],
  });

  const server = new ApolloServer({ schema });
  server.listen({ port: 4003 }).then(({ url }) => {
    console.log(`🚀 Task Service ready at ${url}`);
  });
}

startServer();
