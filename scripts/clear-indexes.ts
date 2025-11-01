import mongoose from 'mongoose'
import 'dotenv/config'
import dbConnect from '../lib/mongodb'
import WishBloom from '../models/WishBloom'

async function clearIndexes() {
  await dbConnect()

  console.log('🧹 Dropping all existing indexes on WishBloom collection...')
  const result = await WishBloom.collection.dropIndexes().catch((err) => {
    if (err.codeName === 'IndexNotFound') {
      console.log('ℹ️ No indexes to drop.')
      return null
    }
    throw err
  })

  console.log('✅ Indexes dropped successfully:', result)
  await mongoose.disconnect()
  process.exit(0)
}

clearIndexes().catch((err) => {
  console.error('❌ Error clearing indexes:', err)
  process.exit(1)
})
