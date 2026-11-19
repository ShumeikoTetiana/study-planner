import { useEffect, useState } from 'react'
import { getErrorMessage, isAbortError } from '../api/httpClient'
import { taskRepository } from '../repositories/taskRepository'
import type { Task } from '../types/task'
import type { LoadStatus } from './useTasks'

// Завантаження одного завдання для сторінки деталей.
// Дані зберігаються лише тут (локальний state), а не в Context
export function useTaskDetails(id: number) {
  const [task, setTask] = useState<Task | null>(null)
  const [status, setStatus] = useState<LoadStatus>('loading')
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    taskRepository
      .getById(id, controller.signal)
      .then((result) => {
        setTask(result)
        setStatus('success')
      })
      .catch((err: unknown) => {
        if (isAbortError(err)) return
        setError(getErrorMessage(err))
        setStatus('error')
      })

    // Закрили деталі до відповіді — запит скасовується
    return () => controller.abort()
  }, [id, reloadKey])

  function reload() {
    setStatus('loading')
    setReloadKey((key) => key + 1)
  }

  return { task, status, error, reload }
}
