// Допустимі значення пріоритету
export type Priority = 'low' | 'medium' | 'high'

// Навчальне завдання
export interface Task {
  id: number
  title: string
  description: string
  completed: boolean
  priority: Priority
  category: string
}

// Дані з форми: те саме, що Task, але без id і completed (їх задаємо самі)
export type NewTask = Omit<Task, 'id' | 'completed'>

// Режими фільтра: всі / не виконані / виконані
export type TaskFilter = 'all' | 'active' | 'completed'

// Підписи пріоритетів українською для інтерфейсу
export const PRIORITY_LABELS: Record<Priority, string> = {
  low: 'Низький',
  medium: 'Середній',
  high: 'Високий',
}
