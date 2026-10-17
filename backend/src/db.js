import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/plotguard';

let isConnected = false;

export async function connectDB() {
  if (isConnected) return mongoose.connection;
  try {
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 3000,
      autoIndex: true
    });
    isConnected = true;
    console.log(`[Database] Connected to MongoDB at ${MONGODB_URI}`);
    return conn.connection;
  } catch (error) {
    console.warn(`[Database] MongoDB connection failed (${error.message}). Running with in-memory fallback enabled.`);
    return null;
  }
}

export function isDbConnected() {
  return isConnected;
}
