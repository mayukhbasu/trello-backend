import { ApolloServer } from 'apollo-server';
import { config } from 'dotenv';
import { MongoClient, ServerApiVersion } from 'mongodb';

// Load environment variables from .env
config();

// Local MongoDB URI (update this if using a remote database like MongoDB Atlas)
const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';

// Create a MongoClient with MongoClientOptions to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Store a reference to the connected client and the database
let connectedClient: MongoClient | null = null;
let db: any = null; // We'll store the database instance here

/**
 * Function to connect to MongoDB and maintain a persistent connection.
 * This function ensures that the client only connects once and reuses the connection.
 */
async function connectToMongoDB() {
  try {
    if (!connectedClient) {
      console.log('Attempting to connect to MongoDB...');
      // Connect the client to the server
      connectedClient = await client.connect();
      // Set the database (replace 'mydatabase' with your database name)
      db = connectedClient.db('mydatabase'); 
      // Send a ping to confirm a successful connection
      await db.command({ ping: 1 });
      console.log('Pinged your deployment. Successfully connected to MongoDB!');
    }
    return connectedClient; // Return the connected client for reuse
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);  // Log detailed error
    throw err;
  }
}

/**
 * Function to close the MongoDB connection.
 * This is useful to properly close connections during application shutdown.
 */
async function closeMongoDBConnection() {
  try {
    if (connectedClient) {
      await connectedClient.close(); // Close the MongoDB connection
      connectedClient = null; // Reset the connected client reference
      console.log('MongoDB connection closed');
    }
  } catch (err) {
    console.error('Error closing MongoDB connection:', err);  // Log detailed error
    throw err;
  }
}

// Define the schema manually using SDL (Schema Definition Language)
const typeDefs = `
  type User {
    name: String!
    email: String!
    pictureUrl: String
  }

  type Query {
    getUsers: [User]
  }

  type Mutation {
    saveUser(name: String!, email: String!, pictureUrl: String): User
  }
`;

// Define resolvers
const resolvers = {
  Query: {
    getUsers: async () => {
      try {
        // Fetch users from the MongoDB collection
        const users = await db.collection('users').find().toArray();
        return users;
      } catch (err) {
        console.error('Error fetching users:', err);
        throw new Error('Error fetching users');
      }
    },
  },
  Mutation: {
    saveUser: async (_: any, { name, email, pictureUrl }: { name: string, email: string, pictureUrl: string }) => {
      try {
        // Check if user with the same email exists
        let user = await db.collection('users').findOne({ email });
        if (!user) {
          // Insert a new user if not found
          user = { name, email, pictureUrl };
          await db.collection('users').insertOne(user);
        } else {
          // Update the existing user
          await db.collection('users').updateOne({ email }, { $set: { name, pictureUrl } });
        }
        return user;
      } catch (err) {
        console.error('Error saving user:', err);
        throw new Error('Error saving user');
      }
    },
  },
};

// Create Apollo Server
async function startServer() {
  await connectToMongoDB(); // Ensure MongoDB is connected before starting the server

  const server = new ApolloServer({
    typeDefs,
    resolvers,
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

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
