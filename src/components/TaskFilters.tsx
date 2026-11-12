import { useTaskContext } from '../hooks/useTaskContext'
import type { TaskFilter } from '../types/task'
import './TaskFilters.scss'

const FILTERS: { value: TaskFilter; label: string }[] = [
  { value: 'all', label: 'Всі' },
  { value: 'active', label: 'Не виконані' },
  { value: 'completed', label: 'Виконані' },
]

// Кнопки фільтра + «Очистити виконані» і «Скинути дані».
// Усе потрібне бере з Context
function TaskFilters() {
  const { tasks, filter, setFilter, clearCompleted, resetTasks } = useTaskContext()

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
            // Активний фільтр позначаємо модифікатором --active
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

      <div className="task-filters__group">
        <button type="button" className="task-filters__link" onClick={clearCompleted}>
          Очистити виконані
        </button>
        <button
          type="button"
          className="task-filters__link task-filters__link--muted"
          onClick={resetTasks}
        >
          Скинути дані
        </button>
      </div>
    </div>
  )
}

export default TaskFilters
