import mongoose from 'mongoose'
import { env } from './env'

const MONGODB_URI = env.MONGODB_URI
const DB_NAME = env.DB_NAME

if (!MONGODB_URI) {
  throw new Error('Please define MONGODB_URI in environment variables')
}

interface CachedConnection {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

declare global {
   
  var mongoose: CachedConnection | undefined
}

const cached: CachedConnection = global.mongoose || { conn: null, promise: null }

if (!global.mongoose) {
  global.mongoose = cached
}

async function dbConnect(): Promise<typeof mongoose> {
  // Return existing connection
  if (cached.conn) {
    return cached.conn
  }

  // Create new connection if none exists
  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      maxPoolSize: 10,
      minPoolSize: 2,
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 10000,
      family: 4, // Use IPv4, skip trying IPv6
      dbName: DB_NAME,
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('✅ MongoDB connected successfully')
      return mongoose
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    console.error('❌ MongoDB connection failed:', e)
    throw e
  }

  return cached.conn
}

// Graceful shutdown
if (typeof process !== 'undefined') {
  process.on('SIGINT', async () => {
    if (cached.conn) {
      await cached.conn.connection.close()
      console.log('MongoDB connection closed through app termination')
      process.exit(0)
    }
  })
}

export default dbConnect