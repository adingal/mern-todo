import mongoose, { Schema, Document } from 'mongoose'
import bcrypt from 'bcrypt'
import validator from 'validator'

export const USER_TYPES = ['user', 'admin'] as const
export type UserType = (typeof USER_TYPES)[number]

export interface IUser extends Document {
  name: string
  email: string
  password: string
  userType: UserType
  createdAt: Date
  comparePassword(candidate: string): Promise<boolean>
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Name is required.'],
    trim: true,
    maxlength: [100, 'Name must be 100 characters or fewer.'],
  },
  email: {
    type: String,
    required: [true, 'Email is required.'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, 'Valid email is required.'],
  },
  password: {
    type: String,
    required: [true, 'Password is required.'],
    minlength: [8, 'Password must be at least 8 characters.'],
    select: false,
  },
  userType: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return
  this.password = await bcrypt.hash(this.password, 10)
})

userSchema.methods.comparePassword = function (candidate: string) {
  return bcrypt.compare(candidate, this.password)
}

const User = mongoose.model<IUser>('User', userSchema)

export default User
