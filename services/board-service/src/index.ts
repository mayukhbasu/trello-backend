import 'reflect-metadata';
import { ApolloServer } from 'apollo-server';
import { buildSchema } from 'type-graphql';
import { BoardResolver } from './resolvers/BoardResolver';

async function startServer() {
  const schema = await buildSchema({
    resolvers: [BoardResolver],
  });

  // Adding CORS configuration to the Apollo Server
  const server = new ApolloServer({
    schema,
    cors: {
      origin: ['http://localhost:3000'], // Allow specific origins
      credentials: true, // Allow credentials such as cookies or authentication headers
    },
  });

  const port = process.env.PORT || 4002;
  server.listen({ port }).then(({ url }) => {
    console.log(`🚀 Board Service ready at ${url}`);
  });
}

startServer();
