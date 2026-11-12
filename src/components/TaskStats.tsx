import { useTaskContext } from '../hooks/useTaskContext'
import './TaskStats.scss'

// Статистика. Окремого стану для лічильників немає:
// числа щоразу рахуються з поточного масиву завдань, тому завжди актуальні
function TaskStats() {
  const { tasks } = useTaskContext()

  const total = tasks.length
  const completed = tasks.filter((task) => task.completed).length
  const active = total - completed

  return (
    <section className="task-stats">
      <div className="task-stats__item">
        <span className="task-stats__value">{total}</span>
        <span className="task-stats__label">Усього</span>
      </div>
      <div className="task-stats__item task-stats__item--completed">
        <span className="task-stats__value">{completed}</span>
        <span className="task-stats__label">Виконано</span>
      </div>
      <div className="task-stats__item task-stats__item--active">
        <span className="task-stats__value">{active}</span>
        <span className="task-stats__label">Не виконано</span>
      </div>
    </section>
  )
}

export default TaskStats
