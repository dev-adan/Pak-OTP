import { MongoClient } from 'mongodb';
import mongoose from 'mongoose';
import { logger } from './logger';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local');
}

const uri = process.env.MONGODB_URI;

let clientPromise;
let cachedClient = null;
let cachedDb = null;

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    const client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  const client = new MongoClient(uri);
  clientPromise = client.connect();
}

export async function connectDB() {
  try {
    if (mongoose.connection.readyState >= 1) {
      return;
    }

    await mongoose.connect(uri);
    logger.info('MongoDB connected successfully');
  } catch (error) {
    logger.error(`MongoDB connection error: ${error.message}`);
    throw new Error('Error connecting to database');
  }
}

export async function getDb() {
  if (!cachedClient || !cachedDb) {
    cachedClient = await clientPromise;
    cachedDb = cachedClient.db();
    logger.info('New database connection established');
  }
  return { client: cachedClient, db: cachedDb };
}

export default clientPromise;
