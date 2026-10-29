import type { Task } from '../types/task'

// Початкові завдання, з якими стартує застосунок.
// Дані живуть лише в пам'яті React, тому після перезавантаження сторінки повертаються до цих
export const initialTasks: Task[] = [
  {
    id: 1,
    title: 'React Components',
    description: 'Опрацювати базові принципи компонентів React',
    completed: false,
    priority: 'high',
    category: 'React',
  },
  {
    id: 2,
    title: 'TypeScript Exercises',
    description: 'Виконати практичні вправи',
    completed: true,
    priority: 'medium',
    category: 'TypeScript',
  },
  {
    id: 3,
    title: 'Прочитати про useState',
    description: 'Розділ «State: A Component’s Memory» на react.dev',
    completed: false,
    priority: 'low',
    category: 'React',
  },
]
