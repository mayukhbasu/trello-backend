import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { UserResolver } from './resolvers/UserResolver';
import { ApolloServer } from 'apollo-server';
import { connectDatabase } from './database';

async function startServer() {
  const schema = await buildSchema({
    resolvers: [UserResolver]
  });
  await connectDatabase();
  // Adding CORS configuration to the Apollo Server
  const server = new ApolloServer({
    schema,
    cors: {
      origin: ['http://localhost:3000'], // Allow specific origins
      credentials: true, // Allow credentials such as cookies or authentication headers
    },
  });

  const port = process.env.PORT || 4001;
  server.listen({ port }).then(({ url }) => {
    console.log(`🚀 User Service ready at ${url}`);
  });
}

startServer();
