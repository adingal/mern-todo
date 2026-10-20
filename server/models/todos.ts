import mongoose, { Schema, Document } from 'mongoose'

export interface ITodo extends Document {
  title: string
  completed: boolean
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const Todo = mongoose.model<ITodo>('Todo', todoSchema)

export default Todo
