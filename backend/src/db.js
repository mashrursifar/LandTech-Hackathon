import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/plotguard';

let isConnected = false;

export async function connectDB() {
  if (isConnected && mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }
  try {
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      autoIndex: true
    });
    isConnected = true;
    const maskedUri = MONGODB_URI.includes('@')
      ? MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')
      : MONGODB_URI;
    console.log(`[Database] Connected to MongoDB at ${maskedUri}`);
    return conn.connection;
  } catch (error) {
    console.warn(`[Database] MongoDB connection failed (${error.message}). Running with in-memory fallback enabled.`);
    return null;
  }
}

export function isDbConnected() {
  return isConnected && mongoose.connection.readyState === 1;
}
