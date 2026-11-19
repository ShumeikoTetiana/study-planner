import { useTaskContext } from '../hooks/useTaskContext'
import TaskItem from './TaskItem'
import './TaskList.scss'

// Список завдань з окремими станами: loading, error, empty, success
function TaskList() {
  const { tasks, status, error, reload, filter } = useTaskContext()

  // 1. Loading
  if (status === 'loading') {
    return <p className="task-list__state">Завантаження…</p>
  }

  // 2. Error + можливість повторити запит
  if (status === 'error') {
    return (
      <div className="task-list__state task-list__state--error">
        <p className="task-list__message">Помилка завантаження: {error}</p>
        <button type="button" className="task-list__retry" onClick={reload}>
          Спробувати ще
        </button>
      </div>
    )
  }

  // 3. Empty — сервер нічого не повернув
  if (tasks.length === 0) {
    return <p className="task-list__state">Завдань не знайдено.</p>
  }

  // Фільтр — client state, застосовується до поточної сторінки
  const visibleTasks = tasks.filter((task) => {
    if (filter === 'active') return !task.completed
    if (filter === 'completed') return task.completed
    return true
  })

  if (visibleTasks.length === 0) {
    return <p className="task-list__state">На цій сторінці немає завдань за обраним фільтром.</p>
  }

  // 4. Success
  return (
    <ul className="task-list">
      {visibleTasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </ul>
  )
}

export default TaskList
