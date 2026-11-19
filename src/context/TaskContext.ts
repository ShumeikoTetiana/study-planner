import { createContext } from 'react'
import type { LoadStatus } from '../hooks/useTasks'
import type { NewTask, Task, TaskFilter } from '../types/task'

export type ToastType = 'success' | 'error' | 'info'

export interface ToastData {
  id: number
  message: string
  type: ToastType
}

// Що Context дає компонентам
export interface TaskContextValue {
  // server state (дані з API)
  tasks: Task[]
  total: number
  status: LoadStatus
  error: string
  page: number
  totalPages: number
  goToPage: (page: number) => void
  reload: () => void

  // операції — повертають true, якщо все вдалося
  addTask: (data: NewTask) => Promise<boolean>
  toggleTask: (task: Task) => Promise<boolean>
  renameTask: (task: Task, title: string) => Promise<boolean>
  deleteTask: (task: Task) => Promise<boolean>

  // client/UI state
  filter: TaskFilter
  setFilter: (filter: TaskFilter) => void
  selectedTaskId: number | null
  openDetails: (id: number) => void
  closeDetails: () => void
  toast: ToastData | null
  hideToast: () => void
}

export const TaskContext = createContext<TaskContextValue | null>(null)
