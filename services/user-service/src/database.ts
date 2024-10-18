// src/mongoClient.ts

import { MongoClient, ServerApiVersion } from 'mongodb';
import { config } from 'dotenv';

// Load environment variables from .env
config();

// Use the environment variable for the MongoDB URI
const uri = process.env.MONGODB_URI || '';

if (!uri) {
  throw new Error('MongoDB connection string not found in environment variables');
}

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

export async function connectToMongoDB() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();

    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 });
    console.log('Pinged your deployment. You successfully connected to MongoDB!');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    throw err;
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
