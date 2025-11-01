#!/usr/bin/env ts-node

/**
 * Database Index Creation Script
 * Run: npm run db:indexes
 * 
 * This script creates all necessary indexes for optimal query performance
 */

import 'dotenv/config'
import mongoose from 'mongoose'
import dbConnect from '../lib/mongodb'
import WishBloom from '../models/WishBloom'
import User from '../models/User'

mongoose.set('strictQuery', false)
async function createIndexes() {
  try {
    console.log('🔌 Connecting to MongoDB...')
    await dbConnect()

    console.log('📊 Creating WishBloom indexes...')
    
    // WishBloom indexes
    await WishBloom.collection.createIndex({ uniqueUrl: 1 }, { unique: true })
    await WishBloom.collection.createIndex({ createdDate: -1 })
    await WishBloom.collection.createIndex({ 'createdBy.id': 1 })
    await WishBloom.collection.createIndex({ viewCount: -1 })
    await WishBloom.collection.createIndex({ isArchived: 1 })
    
    // Compound index for common queries
    await WishBloom.collection.createIndex(
      { isArchived: 1, createdDate: -1 },
      { name: 'active_wishblooms' }
    )

    console.log('✅ WishBloom indexes created')

    // User indexes (if User model exists)
    if (User) {
      console.log('📊 Creating User indexes...')
      await User.collection.createIndex({ email: 1 }, { unique: true })
      await User.collection.createIndex({ createdAt: -1 })
      await User.collection.createIndex({ role: 1 })
      console.log('✅ User indexes created')
    }

    // List all indexes to verify
    console.log('\n📋 Current WishBloom indexes:')
    const wishBloomIndexes = await WishBloom.collection.indexes()
    wishBloomIndexes.forEach((index) => {
      console.log(`  - ${index.name}: ${JSON.stringify(index.key)}`)
    })

    if (User) {
      console.log('\n📋 Current User indexes:')
      const userIndexes = await User.collection.indexes()
      userIndexes.forEach((index) => {
        console.log(`  - ${index.name}: ${JSON.stringify(index.key)}`)
      })
    }

    console.log('\n✨ All indexes created successfully!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error creating indexes:', error)
    process.exit(1)
  }
}

// Run if executed directly
if (require.main === module) {
  createIndexes()
}

export default createIndexes