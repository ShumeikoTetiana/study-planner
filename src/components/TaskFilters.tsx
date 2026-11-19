import { useTaskContext } from '../hooks/useTaskContext'
import type { TaskFilter } from '../types/task'
import './TaskFilters.scss'

const FILTERS: { value: TaskFilter; label: string }[] = [
  { value: 'all', label: 'Всі' },
  { value: 'active', label: 'Не виконані' },
  { value: 'completed', label: 'Виконані' },
]

// Кнопки фільтра (client state). Лічильники — для поточної сторінки
function TaskFilters() {
  const { tasks, filter, setFilter } = useTaskContext()

  const completedCount = tasks.filter((task) => task.completed).length
  const counts: Record<TaskFilter, number> = {
    all: tasks.length,
    active: tasks.length - completedCount,
    completed: completedCount,
  }

  return (
    <div className="task-filters">
      <div className="task-filters__group">
        {FILTERS.map((item) => (
          <button
            key={item.value}
            type="button"
            className={`task-filters__button ${
              filter === item.value ? 'task-filters__button--active' : ''
            }`}
            onClick={() => setFilter(item.value)}
          >
            {item.label}
            <span className="task-filters__count">{counts[item.value]}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default TaskFilters
