import mongoose, { Schema, Document, Types } from 'mongoose'

export const TODO_TYPES = ['home', 'personal', 'work'] as const
export type TodoType = (typeof TODO_TYPES)[number]

export interface ITodo extends Document {
  title: string
  type: TodoType
  completed: boolean
  dueDate?: Date
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
  type: {
    type: String,
    enum: TODO_TYPES,
    default: 'home',
  },
  completed: {
    type: Boolean,
    default: false,
  },
  dueDate: {
    type: Date,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'A todo must belong to a user'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

todoSchema.index({ user: 1, dueDate: 1 })

const Todo = mongoose.model<ITodo>('Todo', todoSchema)

export default Todo
