import type { TaskFilter } from '../types/task'
import './TaskFilters.scss'

interface TaskFiltersProps {
  current: TaskFilter // який фільтр зараз обрано
  counts: Record<TaskFilter, number> // скільки завдань у кожному фільтрі
  onChange: (filter: TaskFilter) => void
  onClearCompleted: () => void
}

const FILTERS: { value: TaskFilter; label: string }[] = [
  { value: 'all', label: 'Всі' },
  { value: 'active', label: 'Не виконані' },
  { value: 'completed', label: 'Виконані' },
]

// Кнопки фільтра. Сам фільтр зберігається в App,
// а цей компонент лише показує кнопки і повідомляє, яку натиснули
function TaskFilters({ current, counts, onChange, onClearCompleted }: TaskFiltersProps) {
  return (
    <div className="task-filters">
      <div className="task-filters__group">
        {FILTERS.map((filter) => (
          <button
            key={filter.value}
            type="button"
            // Активний фільтр позначаємо модифікатором --active
            className={`task-filters__button ${
              current === filter.value ? 'task-filters__button--active' : ''
            }`}
            onClick={() => onChange(filter.value)}
          >
            {filter.label}
            <span className="task-filters__count">{counts[filter.value]}</span>
          </button>
        ))}
      </div>

      {/* Кнопку очищення показуємо лише тоді, коли є що очищати */}
      {counts.completed > 0 && (
        <button type="button" className="task-filters__clear" onClick={onClearCompleted}>
          Очистити виконані
        </button>
      )}
    </div>
  )
}

export default TaskFilters
