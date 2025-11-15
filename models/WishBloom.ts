import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IContributor {
  id: string
  name: string
  email?: string // ✅ Changed from `string | undefined`
  contributionCount: number
}

export interface IMemory {
  id: string
  title: string
  description: string
  date: string
  contributor: IContributor
  imageUrl?: string // ✅ Changed from `string | undefined`
  type: 'standard' | 'featured' | 'quote'
  tags: string[]
  rotation: number
  createdAt: Date
}

export interface IMessage {
  id: string
  type: 'letter' | 'poem'
  greeting?: string // ✅ Changed from `string | undefined`
  content: string
  closing?: string // ✅ Changed from `string | undefined`
  signature: string
  title?: string // ✅ Changed from `string | undefined`
  postscript?: string // ✅ Changed from `string | undefined`
  contributor: IContributor
  date: string
  createdAt: Date
}

export interface IWishBloom extends Document {
  recipientName: string
  age?: number // ✅ Optional (not `number | null`)
  creativeAgeDescription?: string // ✅ Optional
  introMessage: string
  uniqueUrl: string
  createdBy: IContributor
  contributors: IContributor[]
  memories: IMemory[]
  messages: IMessage[]
  celebrationWishPhrases: string[]
  createdDate: Date
  viewCount: number
  isArchived: boolean
  createdAt: Date
  updatedAt: Date
}

// Schemas
const ContributorSchema = new Schema<IContributor>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String },
  contributionCount: { type: Number, default: 1 },
})

const MemorySchema = new Schema<IMemory>({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: String, required: true },
  contributor: { type: ContributorSchema, required: true },
  imageUrl: { type: String }, // ✅ No default, just optional
  type: { type: String, enum: ['standard', 'featured', 'quote'], default: 'standard' },
  tags: [{ type: String }],
  rotation: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
})

const MessageSchema = new Schema<IMessage>({
  id: { type: String, required: true },
  type: { type: String, enum: ['letter', 'poem'], required: true },
  greeting: { type: String },
  content: { type: String, required: true },
  closing: { type: String },
  signature: { type: String, required: true },
  title: { type: String },
  postscript: { type: String },
  contributor: { type: ContributorSchema, required: true },
  date: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
})

const WishBloomSchema = new Schema<IWishBloom>(
  {
    recipientName: { type: String, required: true },
    age: { type: Number }, // ✅ Optional, no default
    creativeAgeDescription: { type: String },
    introMessage: { type: String, required: true },
    uniqueUrl: { type: String, required: true },
    createdBy: { type: ContributorSchema, required: true },
    contributors: [ContributorSchema],
    memories: [MemorySchema],
    messages: [MessageSchema],
    celebrationWishPhrases: [{ type: String }],
    createdDate: { type: Date, default: Date.now },
    viewCount: { type: Number, default: 0 },
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true }
)

// Indexes
WishBloomSchema.index({ uniqueUrl: 1 }, { unique: true })
WishBloomSchema.index({ 'createdBy.id': 1 })
WishBloomSchema.index({ viewCount: -1 })
WishBloomSchema.index({ isArchived: 1 })
WishBloomSchema.index({ createdDate: -1 })
WishBloomSchema.index({ isArchived: 1, createdDate: -1 })

export default (mongoose.models.WishBloom as Model<IWishBloom>) || 
  mongoose.model<IWishBloom>('WishBloom', WishBloomSchema)