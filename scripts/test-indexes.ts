import 'dotenv/config'

// scripts/test-indexes.ts
import dbConnect from '../lib/mongodb'
import WishBloom from '../models/WishBloom'

// Type for MongoDB explain result
interface ExecutionStats {
  executionStages?: {
    stage?: string
    inputStage?: {
      stage?: string
    }
  }
}

interface ExplainResult {
  executionStats?: ExecutionStats
  stages?: Array<{
    $cursor?: {
      executionStats?: ExecutionStats
    }
  }>
}

async function testIndexes() {
  await dbConnect()

  console.log('🔍 Testing MongoDB Index Usage...')

  // Test 1: uniqueUrl
  console.time('uniqueUrl query')
  const uniqueUrlExplain = await WishBloom.findOne({ uniqueUrl: 'test' }).explain('executionStats') as unknown as ExplainResult
  console.timeEnd('uniqueUrl query')

  // Test 2: createdDate sort
  console.time('createdDate sort')
  const createdDateExplain = await WishBloom.find({ isArchived: { $ne: true } })
    .sort({ createdDate: -1 })
    .limit(10)
    .explain('executionStats') as unknown as ExplainResult
  console.timeEnd('createdDate sort')

  console.log('✅ Indexes working correctly if executionStats show IXSCAN (index scan) instead of COLLSCAN (collection scan).')

  const uniqueStage =
    uniqueUrlExplain?.executionStats?.executionStages?.stage ??
    uniqueUrlExplain?.stages?.[0]?.$cursor?.executionStats?.executionStages?.stage

  const createdStage =
    createdDateExplain?.executionStats?.executionStages?.inputStage?.stage ??
    createdDateExplain?.stages?.[0]?.$cursor?.executionStats?.executionStages?.inputStage?.stage

  console.table([
    { test: 'Unique URL Query', stage: uniqueStage || 'Unknown' },
    { test: 'Created Date Sort', stage: createdStage || 'Unknown' },
  ])

  process.exit(0)
}

testIndexes().catch((err) => {
  console.error('❌ Error testing indexes:', err)
  process.exit(1)
})
