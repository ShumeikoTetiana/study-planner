import { useCallback, useEffect, useReducer, useState, type ReactNode } from 'react'
import { initialTasks } from '../data/initialTasks'
import { readFromStorage, useLocalStorage, writeToStorage } from '../hooks/useLocalStorage'
import { taskReducer, type TaskState } from '../reducers/taskReducer'
import type { NewTask, Task, TaskFilter } from '../types/task'
import {
  TaskContext,
  UNDO_DELAY,
  type TaskContextValue,
  type ToastData,
  type ToastType,
} from './TaskContext'

const TASKS_KEY = 'study-planner:tasks'
const FILTER_KEY = 'study-planner:filter'

// Початковий стан reducer: беремо збережені завдання, а якщо їх немає
// або вони пошкоджені — стартовий список
function initTaskState(): TaskState {
  const saved = readFromStorage<unknown>(TASKS_KEY, null)
  const tasks = Array.isArray(saved) ? (saved as Task[]) : initialTasks
  return { tasks, pendingDelete: null }
}

// Провайдер тримає весь спільний стан і роздає його через Context
export function TaskProvider({ children }: { children: ReactNode }) {
  // tasks — єдине джерело правди, ним керує тільки reducer
  const [state, dispatch] = useReducer(taskReducer, undefined, initTaskState)
  // Фільтр зберігається між перезавантаженнями через наш custom hook
  const [filter, setFilter] = useLocalStorage<TaskFilter>(FILTER_KEY, 'all')
  // Поточне toast-повідомлення
  const [toast, setToast] = useState<ToastData | null>(null)

  const { tasks, pendingDelete } = state

  function showToast(message: string, type: ToastType = 'success') {
    setToast({ id: Date.now(), message, type })
  }

  // useCallback — щоб функція не змінювалась при кожному рендері
  // (Toast використовує її в залежностях свого таймера)
  const hideToast = useCallback(() => setToast(null), [])

  // --- Effects ---

  // 1. Після кожної зміни tasks зберігаємо їх у localStorage
  useEffect(() => {
    writeToStorage(TASKS_KEY, tasks)
  }, [tasks])

  // 2. Заголовок вкладки показує кількість невиконаних завдань
  const activeCount = tasks.filter((task) => !task.completed).length
  useEffect(() => {
    document.title = `Study Planner — ${activeCount} active ${activeCount === 1 ? 'task' : 'tasks'}`
  }, [activeCount])

  // 3. Таймер Undoable Delete. Запускається, коли з'являється pendingDelete.
  // Якщо pendingDelete змінився (Undo або нове видалення) чи компонент зник —
  // cleanup очищує старий таймер через clearTimeout
  useEffect(() => {
    if (!pendingDelete) return

    const timer = setTimeout(() => {
      dispatch({ type: 'confirmDelete' })
      const count = pendingDelete.ids.length
      setToast({
        id: Date.now(),
        message: count === 1 ? 'Завдання видалено' : `Видалено завдань: ${count}`,
        type: 'success',
      })
    }, UNDO_DELAY)

    return () => clearTimeout(timer)
  }, [pendingDelete])

  // --- Операції, які бачать компоненти ---

  function addTask(data: NewTask) {
    const task: Task = { ...data, id: Date.now(), completed: false }
    dispatch({ type: 'add', payload: { task } })
    showToast(`Завдання «${task.title}» додано`)
  }

  function updateTask(id: number, changes: NewTask) {
    dispatch({ type: 'update', payload: { id, changes } })
    showToast('Зміни збережено')
  }

  function toggleTask(id: number) {
    dispatch({ type: 'toggle', payload: { id } })
  }

  function requestDelete(id: number) {
    dispatch({ type: 'requestDelete', payload: { id } })
  }

  function undoDelete() {
    dispatch({ type: 'undoDelete' })
    showToast('Видалення скасовано', 'info')
  }

  function clearCompleted() {
    if (!tasks.some((task) => task.completed)) {
      showToast('Немає виконаних завдань для очищення', 'error')
      return
    }
    dispatch({ type: 'clearCompleted' })
  }

  function resetTasks() {
    dispatch({ type: 'reset' })
    setFilter('all')
    showToast('Дані скинуто до початкових', 'info')
  }

  const value: TaskContextValue = {
    tasks,
    filter,
    setFilter,
    pendingDelete,
    addTask,
    updateTask,
    toggleTask,
    requestDelete,
    undoDelete,
    clearCompleted,
    resetTasks,
    toast,
    hideToast,
  }

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>
}
