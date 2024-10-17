import 'reflect-metadata';
import { ApolloServer } from 'apollo-server';
import { buildSchema } from 'type-graphql';
import { TaskResolver } from './resolvers/TaskResolver';

async function startServer() {
  const schema = await buildSchema({
    resolvers: [TaskResolver],
  });

  // Adding CORS configuration to the Apollo Server
  const server = new ApolloServer({
    schema,
    cors: {
      origin: ['http://localhost:3000'], // Allow specific origins
      credentials: true, // Allow credentials such as cookies or authentication headers
    },
  });

  const port = process.env.PORT || 4003;
  server.listen({ port }).then(({ url }) => {
    console.log(`🚀 Task Service ready at ${url}`);
  });
}

startServer();
