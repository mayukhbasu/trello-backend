import { MongoClient, ServerApiVersion } from 'mongodb';
import { config } from 'dotenv';

// Load environment variables from .env
config();

// Local MongoDB URI
const uri = 'mongodb://127.0.0.1:27017';

if (!uri) {
  throw new Error('MongoDB connection string not found in environment variables');
}

// Create a MongoClient with MongoClientOptions to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Store a reference to the connected client
let connectedClient: MongoClient | null = null;

/**
 * Function to connect to MongoDB and maintain a persistent connection.
 * This function ensures that the client only connects once and reuses the connection.
 */
export async function connectToMongoDB() {
  try {
    if (!connectedClient) {
      console.log('Attempting to connect to MongoDB...');
      // Connect the client to the server
      connectedClient = await client.connect();
      // Send a ping to confirm a successful connection
      await connectedClient.db('admin').command({ ping: 1 });
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
export async function closeMongoDBConnection() {
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
