import mongoose, { Schema, Document, Model } from 'mongoose'
import type { IMemory, IMessage } from './WishBloom'

export interface IDraft extends Document {
  userId: string
  step: number
  progress: number
  payload: {
    recipientName?: string
    age?: number | null
    creativeAgeDescription?: string
    introMessage?: string
    createdBy?: {
      id?: string
      name: string
      email?: string
      contributionCount?: number
    }
    memories?: IMemory[]
    messages?: IMessage[]
    celebrationWishPhrases?: string[]
  }
  lastUpdated: Date
  expiresAt: Date
  createdAt: Date
  updatedAt: Date
}

const DraftSchema = new Schema<IDraft>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    step: {
      type: Number,
      default: 1,
      min: 1,
      max: 6,
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    payload: {
      type: Schema.Types.Mixed,
      required: true,
      default: {},
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
)

DraftSchema.index({ userId: 1, updatedAt: -1 })

DraftSchema.pre('save', function (next) {
  this.lastUpdated = new Date()
  
  if (!this.expiresAt) {
    const thirtyDaysFromNow = new Date()
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
    this.expiresAt = thirtyDaysFromNow
  }
  
  next()
})

export default (mongoose.models.Draft as Model<IDraft>) || 
  mongoose.model<IDraft>('Draft', DraftSchema)
