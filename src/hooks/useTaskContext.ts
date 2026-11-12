import { useContext } from 'react'
import { TaskContext } from '../context/TaskContext'

// Зручний доступ до TaskContext.
// Якщо компонент стоїть поза <TaskProvider>, одразу отримуємо зрозумілу помилку
export function useTaskContext() {
  const context = useContext(TaskContext)
  if (!context) {
    throw new Error('useTaskContext потрібно використовувати всередині <TaskProvider>')
  }
  return context
}
