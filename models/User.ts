import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document {
  name: string
  email: string
  emailVerified?: Date
  image?: string
  hashedPassword?: string
  role: 'user' | 'admin'
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    emailVerified: {
      type: Date,
    },
    image: {
      type: String,
    },
    hashedPassword: {
      type: String,
      select: false, // Don't include by default in queries
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  {
    timestamps: true,
  }
)

// Indexes
UserSchema.index({ email: 1 })
UserSchema.index({ createdAt: -1 })

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema)