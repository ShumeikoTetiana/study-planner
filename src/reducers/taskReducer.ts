import { initialTasks } from '../data/initialTasks'
import type { NewTask, Task } from '../types/task'

export interface PendingDelete {
  ids: number[]
}

export interface TaskState {
  tasks: Task[]
  pendingDelete: PendingDelete | null
}

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
function withoutPending(state: TaskState): Task[] {
  if (!state.pendingDelete) return state.tasks
  const ids = state.pendingDelete.ids
  return state.tasks.filter((task) => !ids.includes(task.id))
}

// Reducer — чиста функція: отримує старий стан і дію, повертає НОВИЙ стан.
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

    case 'requestDelete':
      return {
        tasks: withoutPending(state),
        pendingDelete: { ids: [action.payload.id] },
      }

    case 'clearCompleted': {
      const tasks = withoutPending(state)
      const ids = tasks.filter((task) => task.completed).map((task) => task.id)
      if (ids.length === 0) return state
      return { tasks, pendingDelete: { ids } }
    }

    case 'confirmDelete':
      return { tasks: withoutPending(state), pendingDelete: null }

    case 'undoDelete':
      return { ...state, pendingDelete: null }

    case 'reset':
      return { tasks: initialTasks, pendingDelete: null }

    default:
      return state
  }
}
