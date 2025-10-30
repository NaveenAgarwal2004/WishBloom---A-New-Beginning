import mongoose from 'mongoose'

const ContributorSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String },
  contributionCount: { type: Number, default: 1 },
})

const MemorySchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: String, required: true },
  contributor: { type: ContributorSchema, required: true },
  imageUrl: { type: String },
  type: { type: String, enum: ['standard', 'featured', 'quote'], default: 'standard' },
  tags: [{ type: String }],
  rotation: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
})

const MessageSchema = new mongoose.Schema({
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

const WishBloomSchema = new mongoose.Schema(
  {
    recipientName: { type: String, required: true },
    age: { type: Number },
    creativeAgeDescription: { type: String },
    introMessage: { type: String, required: true },
    uniqueUrl: { type: String, required: true, unique: true },
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

export default mongoose.models.WishBloom || mongoose.model('WishBloom', WishBloomSchema)
