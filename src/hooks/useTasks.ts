import { useEffect, useState } from 'react'
import { getErrorMessage, isAbortError } from '../api/httpClient'
import { taskRepository, type TaskChanges } from '../repositories/taskRepository'
import type { NewTask, Task } from '../types/task'

export type LoadStatus = 'loading' | 'success' | 'error'

export const PAGE_SIZE = 10

// Server state списку завдань: що прийшло з API, сторінка, стан завантаження.
// Усі запити йдуть через taskRepository — тут немає ні URL, ні fetch
export function useTasks() {
  const [page, setPage] = useState(1)
  const [tasks, setTasks] = useState<Task[]>([])
  const [total, setTotal] = useState(0)
  const [status, setStatus] = useState<LoadStatus>('loading')
  const [error, setError] = useState('')
  // Зміна цього числа змушує ефект завантажити список ще раз («Спробувати ще»)
  const [reloadKey, setReloadKey] = useState(0)

  // Завантаження сторінки. Запускається при зміні page або reloadKey
  useEffect(() => {
    const controller = new AbortController()

    taskRepository
      .getAll(page, PAGE_SIZE, controller.signal)
      .then((result) => {
        setTasks(result.tasks)
        setTotal(result.total)
        setStatus('success')
      })
      .catch((err: unknown) => {
        // Скасований запит — це не помилка, просто ігноруємо
        if (isAbortError(err)) return
        setError(getErrorMessage(err))
        setStatus('error')
      })

    // Cleanup: якщо сторінку змінили до відповіді — скасовуємо старий запит
    return () => controller.abort()
  }, [page, reloadKey])

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  function goToPage(nextPage: number) {
    if (nextPage < 1 || nextPage > totalPages || nextPage === page) return
    setStatus('loading')
    setPage(nextPage)
  }

  function reload() {
    setStatus('loading')
    setReloadKey((key) => key + 1)
  }

  // ---------- Mutations: спершу запит через repository, після успіху — оновлюємо UI ----------
  // (DummyJSON нічого не зберігає, тому список оновлюємо самі, без повторного GET)

  async function createTask(data: NewTask) {
    const task = await taskRepository.create(data)
    setTasks((prev) => [task, ...prev])
    setTotal((prev) => prev + 1)
    return task
  }

  async function updateTask(task: Task, changes: TaskChanges) {
    const updated = await taskRepository.update(task, changes)
    setTasks((prev) => prev.map((item) => (item.id === task.id ? updated : item)))
    return updated
  }

  async function deleteTask(id: number) {
    await taskRepository.delete(id)
    setTasks((prev) => prev.filter((item) => item.id !== id))
    setTotal((prev) => prev - 1)
  }

  return {
    tasks,
    total,
    page,
    totalPages,
    status,
    error,
    goToPage,
    reload,
    createTask,
    updateTask,
    deleteTask,
  }
}
