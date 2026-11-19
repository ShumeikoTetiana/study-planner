import { request } from '../api/httpClient'
import type { NewTask, Task } from '../types/task'

// ---------- Формат даних DummyJSON (DTO) — назовні repository його не видно ----------

interface ApiTodo {
  id: number
  todo: string
  completed: boolean
  userId: number
}

interface TodosResponse {
  todos: ApiTodo[]
  total: number
  skip: number
  limit: number
}

// Що отримує UI: завдання поточної сторінки і загальна кількість
export interface TasksPage {
  tasks: Task[]
  total: number
}

// Що можна змінити в існуючому завданні через API
export interface TaskChanges {
  title?: string
  completed?: boolean
}

// ---------- Mapping: API todo → наш Task ----------
// description, priority, category у DummyJSON немає — це client-only поля зі значеннями за замовчуванням
function toTask(todo: ApiTodo): Task {
  return {
    id: todo.id,
    title: todo.todo,
    description: '',
    completed: todo.completed,
    priority: 'medium',
    category: 'General',
  }
}

// ---------- Обмеження навчального API ----------
// DummyJSON лише імітує POST: нове завдання НЕ зберігається на сервері,
// і кожне отримує однаковий id. Тому створені завдання repository пам'ятає сам
// (з унікальним id) — і для них не робить запитів, яких сервер не зрозуміє
const createdTasks = new Map<number, Task>()

// ---------- Repository: єдина точка доступу до завдань ----------
export const taskRepository = {
  // GET /todos?limit=&skip= — список з пагінацією
  async getAll(page: number, limit: number, signal?: AbortSignal): Promise<TasksPage> {
    const skip = (page - 1) * limit
    const data = await request<TodosResponse>(`/todos?limit=${limit}&skip=${skip}`, { signal })
    const tasks = data.todos.map(toTask)

    // Створені локально завдання показуємо на першій сторінці
    if (page === 1) {
      return { tasks: [...createdTasks.values(), ...tasks], total: data.total + createdTasks.size }
    }
    return { tasks, total: data.total + createdTasks.size }
  },

  // GET /todos/:id — одне завдання
  async getById(id: number, signal?: AbortSignal): Promise<Task> {
    const created = createdTasks.get(id)
    if (created) return created

    const todo = await request<ApiTodo>(`/todos/${id}`, { signal })
    return toTask(todo)
  },

  // POST /todos/add — створення
  async create(data: NewTask): Promise<Task> {
    const todo = await request<ApiTodo>('/todos/add', {
      method: 'POST',
      body: { todo: data.title, completed: false, userId: 1 },
    })

    // Беремо відповідь сервера + наші client-only поля; id робимо унікальним
    const task: Task = { ...toTask(todo), ...data, id: Date.now() }
    createdTasks.set(task.id, task)
    return task
  },

  // PUT /todos/:id — оновлення назви та/або completed
  async update(task: Task, changes: TaskChanges): Promise<Task> {
    const updated: Task = { ...task, ...changes }

    if (createdTasks.has(task.id)) {
      createdTasks.set(task.id, updated)
      return updated
    }

    const body: Partial<ApiTodo> = {}
    if (changes.title !== undefined) body.todo = changes.title
    if (changes.completed !== undefined) body.completed = changes.completed

    const todo = await request<ApiTodo>(`/todos/${task.id}`, { method: 'PUT', body })
    // Поля з сервера + client-only поля, які сервер не знає
    return { ...updated, title: todo.todo, completed: todo.completed }
  },

  // DELETE /todos/:id — видалення
  async delete(id: number): Promise<void> {
    if (createdTasks.delete(id)) return
    await request<ApiTodo>(`/todos/${id}`, { method: 'DELETE' })
  },
}
