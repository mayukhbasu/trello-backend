import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { UserResolver } from './resolvers/UserResolver';
import { ApolloServer } from 'apollo-server';

async function startServer() {
  const schema = await buildSchema({
    resolvers: [UserResolver],
  });

  // Adding CORS configuration to the Apollo Server
  const server = new ApolloServer({
    schema,
    cors: {
      origin: ['http://localhost:3000'], // Allow specific origins, you can add multiple origins in the array
      methods: ['GET', 'POST', 'OPTIONS'], // Specify allowed methods
      allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
      credentials: true, // Allow credentials such as cookies or authentication headers
      optionsSuccessStatus: 204, // For legacy browsers (default status for successful OPTIONS requests)
    },
  });

  const port = process.env.PORT || 4001;
  server.listen({ port }).then(({ url }) => {
    console.log(`🚀 User Service ready at ${url}`);
  });
}

startServer();
