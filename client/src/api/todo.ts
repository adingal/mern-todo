import { request } from './request'

// Delete todo
export const deleteTodo = (id: string) =>
  request<unknown>(`/api/todos/${id}`, { method: 'DELETE' })
