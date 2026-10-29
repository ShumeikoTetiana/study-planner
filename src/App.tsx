import { useState } from 'react'
import Header from './components/Header'
import TaskForm from './components/TaskForm'
import TaskStats from './components/TaskStats'
import TaskFilters from './components/TaskFilters'
import TaskList from './components/TaskList'
import { initialTasks } from './data/initialTasks'
import type { NewTask, Task, TaskFilter } from './types/task'

// Головний компонент. Тут живе стан, потрібний кільком компонентам:
// список завдань і обраний фільтр. Дочірні компоненти отримують їх через props
// і змінюють через callback-функції
function App() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [filter, setFilter] = useState<TaskFilter>('all')

  // --- Обчислювані значення (не state!) — рахуються з tasks при кожному рендері ---

  // Завдання, які треба показати при поточному фільтрі. Вихідний масив tasks не змінюється
  const visibleTasks = tasks.filter((task) => {
    if (filter === 'active') return !task.completed
    if (filter === 'completed') return task.completed
    return true
  })

  const completedCount = tasks.filter((task) => task.completed).length
  const counts: Record<TaskFilter, number> = {
    all: tasks.length,
    active: tasks.length - completedCount,
    completed: completedCount,
  }

  // --- Зміна стану. Скрізь створюємо НОВИЙ масив, старий не чіпаємо ---

  function addTask(data: NewTask) {
    const newTask: Task = { ...data, id: Date.now(), completed: false }
    // [...prev, newTask] — новий масив: старі завдання + нове в кінці
    setTasks((prev) => [...prev, newTask])
  }

  function toggleTask(id: number) {
    // map повертає новий масив; потрібне завдання замінюємо новим об'єктом
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)),
    )
  }

  function deleteTask(id: number) {
    // filter повертає новий масив без видаленого завдання
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }

  function clearCompleted() {
    setTasks((prev) => prev.filter((task) => !task.completed))
  }

  return (
    <div className="app">
      <Header />

      <main className="app__content">
        <TaskForm onAdd={addTask} />
        <TaskStats tasks={tasks} />
        <TaskFilters
          current={filter}
          counts={counts}
          onChange={setFilter}
          onClearCompleted={clearCompleted}
        />
        <TaskList
          tasks={visibleTasks}
          hasAnyTasks={tasks.length > 0}
          onToggle={toggleTask}
          onDelete={deleteTask}
        />
      </main>
    </div>
  )
}

export default App
