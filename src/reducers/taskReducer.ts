import { initialTasks } from '../data/initialTasks'
import type { NewTask, Task } from '../types/task'

// Завдання, які чекають на остаточне видалення (Undoable Delete).
// Одне завдання — після «Видалити», кілька — після «Очистити виконані»
export interface PendingDelete {
  ids: number[]
}

// Увесь стан, яким керує reducer
export interface TaskState {
  tasks: Task[]
  pendingDelete: PendingDelete | null
}

// Усі можливі дії. Кожна має свій type і, якщо треба, payload з даними
export type TaskAction =
  | { type: 'add'; payload: { task: Task } }
  | { type: 'toggle'; payload: { id: number } }
  | { type: 'update'; payload: { id: number; changes: NewTask } }
  | { type: 'requestDelete'; payload: { id: number } }
  | { type: 'confirmDelete' }
  | { type: 'undoDelete' }
  | { type: 'clearCompleted' }
  | { type: 'reset' }

// Прибирає зі списку завдання, які вже чекали на видалення.
// Потрібно, коли нове видалення починається раніше, ніж закінчився таймер попереднього
function withoutPending(state: TaskState): Task[] {
  if (!state.pendingDelete) return state.tasks
  const ids = state.pendingDelete.ids
  return state.tasks.filter((task) => !ids.includes(task.id))
}

// Reducer — чиста функція: отримує старий стан і дію, повертає НОВИЙ стан.
// Тут немає таймерів, localStorage, запитів чи роботи з DOM
export function taskReducer(state: TaskState, action: TaskAction): TaskState {
  switch (action.type) {
    case 'add':
      return { ...state, tasks: [...state.tasks, action.payload.task] }

    case 'toggle':
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id ? { ...task, completed: !task.completed } : task,
        ),
      }

    case 'update':
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id ? { ...task, ...action.payload.changes } : task,
        ),
      }

    // Не видаляємо одразу, а лише позначаємо завдання як «буде видалено»
    case 'requestDelete':
      return {
        tasks: withoutPending(state),
        pendingDelete: { ids: [action.payload.id] },
      }

    // Те саме, але для всіх виконаних завдань одразу (з можливістю Undo)
    case 'clearCompleted': {
      const tasks = withoutPending(state)
      const ids = tasks.filter((task) => task.completed).map((task) => task.id)
      if (ids.length === 0) return state
      return { tasks, pendingDelete: { ids } }
    }

    // Таймер закінчився — видаляємо остаточно
    case 'confirmDelete':
      return { tasks: withoutPending(state), pendingDelete: null }

    // Натиснули «Скасувати» — завдання залишаються
    case 'undoDelete':
      return { ...state, pendingDelete: null }

    case 'reset':
      return { tasks: initialTasks, pendingDelete: null }

    default:
      return state
  }
}
