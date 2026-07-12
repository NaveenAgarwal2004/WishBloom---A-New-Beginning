import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IBlogPost extends Document {
  title: string
  slug: string
  description: string
  content: string
  coverImage?: string
  published: boolean
  tier: 1 | 2 | 3
  readTime: string
  faqSchema?: Record<string, unknown>
  author: {
    name: string
    email: string
  }
  createdAt: Date
  updatedAt: Date
}

const BlogPostSchema = new Schema<IBlogPost>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    content: { type: String, required: true },
    coverImage: { type: String },
    published: { type: Boolean, default: false },
    tier: { type: Number, enum: [1, 2, 3], default: 2 },
    readTime: { type: String, default: '3 min read' },
    faqSchema: { type: Schema.Types.Mixed },
    author: {
      name: { type: String, required: true },
      email: { type: String, required: true },
    },
  },
  { timestamps: true }
)

BlogPostSchema.index({ slug: 1 }, { unique: true })
BlogPostSchema.index({ published: 1, createdAt: -1 })

export default (mongoose.models.BlogPost as Model<IBlogPost>) ||
  mongoose.model<IBlogPost>('BlogPost', BlogPostSchema)
