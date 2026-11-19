import { useTaskContext } from '../hooks/useTaskContext'
import './TaskStats.scss'

// Статистика: загальна кількість з сервера + виконані/невиконані на поточній сторінці.
// Числа рахуються з даних, окремого state для них немає
function TaskStats() {
  const { tasks, total } = useTaskContext()

  const completed = tasks.filter((task) => task.completed).length
  const active = tasks.length - completed

  return (
    <section className="task-stats">
      <div className="task-stats__item">
        <span className="task-stats__value">{total}</span>
        <span className="task-stats__label">Усього на сервері</span>
      </div>
      <div className="task-stats__item task-stats__item--completed">
        <span className="task-stats__value">{completed}</span>
        <span className="task-stats__label">Виконано на сторінці</span>
      </div>
      <div className="task-stats__item task-stats__item--active">
        <span className="task-stats__value">{active}</span>
        <span className="task-stats__label">Не виконано на сторінці</span>
      </div>
    </section>
  )
}

export default TaskStats
