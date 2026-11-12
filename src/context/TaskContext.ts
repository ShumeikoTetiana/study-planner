import { createContext } from 'react'
import type { PendingDelete } from '../reducers/taskReducer'
import type { NewTask, Task, TaskFilter } from '../types/task'

// Скільки часу є, щоб натиснути «Скасувати» (мс)
export const UNDO_DELAY = 5000

export type ToastType = 'success' | 'error' | 'info'

export interface ToastData {
  id: number
  message: string
  type: ToastType
}

// Що Context дає компонентам: дані та готові функції.
// Компоненти не знають ні про reducer, ні про таймер — просто викликають ці функції
export interface TaskContextValue {
  tasks: Task[]
  filter: TaskFilter
  setFilter: (filter: TaskFilter) => void
  pendingDelete: PendingDelete | null
  addTask: (data: NewTask) => void
  updateTask: (id: number, changes: NewTask) => void
  toggleTask: (id: number) => void
  requestDelete: (id: number) => void
  undoDelete: () => void
  clearCompleted: () => void
  resetTasks: () => void
  toast: ToastData | null
  hideToast: () => void
}

// Сам Context. null — означає «використали поза TaskProvider»
export const TaskContext = createContext<TaskContextValue | null>(null)
