import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI || !MONGODB_URI.startsWith('mongodb')) {
  console.error('❌ DATABASE ERROR: MONGODB_URI is missing or invalid in .env.local');
  console.log('Current MONGODB_URI:', MONGODB_URI);
  throw new Error('Invalid MONGODB_URI. Please check your .env.local file.');
}

console.log('🔌 Attempting to connect to remote MongoDB...');
const maskedUri = MONGODB_URI.replace(/\/\/(.*):(.*)@/, '//***:***@');
console.log(`🔗 Target: ${maskedUri}`);

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections from growing exponentially
 * during API Route usage.
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;
