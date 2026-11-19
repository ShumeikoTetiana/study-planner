import { useCallback, useState, type ReactNode } from 'react'
import { getErrorMessage } from '../api/httpClient'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useTasks } from '../hooks/useTasks'
import type { NewTask, Task, TaskFilter } from '../types/task'
import { TaskContext, type TaskContextValue, type ToastData, type ToastType } from './TaskContext'

const FILTER_KEY = 'study-planner:filter'

// Провайдер поєднує server state (useTasks) і client/UI state (фільтр, вибране завдання, toast)
// і роздає все компонентам через Context
export function TaskProvider({ children }: { children: ReactNode }) {
  // Server state — дані з API (єдине джерело правди для завдань)
  const list = useTasks()

  // Client/UI state
  const [filter, setFilter] = useLocalStorage<TaskFilter>(FILTER_KEY, 'all')
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null)
  const [toast, setToast] = useState<ToastData | null>(null)

  function showToast(message: string, type: ToastType = 'success') {
    setToast({ id: Date.now(), message, type })
  }

  const hideToast = useCallback(() => setToast(null), [])

  // Кожна операція: виклик через useTasks → repository → API.
  // Успіх — зелене повідомлення, помилка — червоне з нормалізованим текстом
  async function addTask(data: NewTask) {
    try {
      await list.createTask(data)
      showToast(`Завдання «${data.title}» створено`)
      return true
    } catch (err) {
      showToast(getErrorMessage(err), 'error')
      return false
    }
  }

  async function toggleTask(task: Task) {
    try {
      await list.updateTask(task, { completed: !task.completed })
      return true
    } catch (err) {
      showToast(getErrorMessage(err), 'error')
      return false
    }
  }

  async function renameTask(task: Task, title: string) {
    try {
      await list.updateTask(task, { title })
      showToast('Назву змінено')
      return true
    } catch (err) {
      showToast(getErrorMessage(err), 'error')
      return false
    }
  }

  async function deleteTask(task: Task) {
    try {
      await list.deleteTask(task.id)
      showToast(`Завдання «${task.title}» видалено`)
      return true
    } catch (err) {
      showToast(getErrorMessage(err), 'error')
      return false
    }
  }

  const value: TaskContextValue = {
    tasks: list.tasks,
    total: list.total,
    status: list.status,
    error: list.error,
    page: list.page,
    totalPages: list.totalPages,
    goToPage: list.goToPage,
    reload: list.reload,
    addTask,
    toggleTask,
    renameTask,
    deleteTask,
    filter,
    setFilter,
    selectedTaskId,
    openDetails: setSelectedTaskId,
    closeDetails: () => setSelectedTaskId(null),
    toast,
    hideToast,
  }

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>
}
