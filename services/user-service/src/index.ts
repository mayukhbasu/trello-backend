import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { UserResolver } from './resolvers/UserResolver';
import { ApolloServer } from 'apollo-server';
import { connectToMongoDB } from './database';

async function startServer() {
  await connectToMongoDB();
  const schema = await buildSchema({
    resolvers: [UserResolver]
  });
  
  // Adding CORS configuration to the Apollo Server
  const server = new ApolloServer({
    schema,
    cors: {
      origin: [
        'http://localhost:3000', // Allow your local frontend (if applicable)
        'https://studio.apollographql.com', // Allow Apollo Studio
      ],
      credentials: true, // Allow credentials like cookies and authentication headers
    },
    introspection: true, // Allow introspection (optional in dev)
  });
  const port = process.env.PORT || 4001;
  server.listen({ port }).then(({ url }) => {
    console.log(`🚀 User Service ready at ${url}`);
  });
}

startServer();
