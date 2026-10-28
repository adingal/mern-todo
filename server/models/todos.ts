import mongoose, { Schema, Document, Types } from 'mongoose'

export interface ITodo extends Document {
  title: string
  completed: boolean
  user: Types.ObjectId
  createdAt: Date
}

const todoSchema = new Schema<ITodo>({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title must be 200 characters or fewer'],
  },
  completed: {
    type: Boolean,
    default: false,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'A todo must belong to a user'],
    index: true, // Index for query
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const Todo = mongoose.model<ITodo>('Todo', todoSchema)

export default Todo
