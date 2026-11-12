import { useTaskContext } from '../hooks/useTaskContext'
import TaskItem from './TaskItem'
import './TaskList.scss'

// Список завдань. Завдання та фільтр бере з Context — props більше не потрібні
function TaskList() {
  const { tasks, filter } = useTaskContext()

  // Відфільтрований список рахуємо під час рендеру (derived state, без useEffect)
  const visibleTasks = tasks.filter((task) => {
    if (filter === 'active') return !task.completed
    if (filter === 'completed') return task.completed
    return true
  })

  // Умовний рендеринг: завдань немає зовсім
  if (tasks.length === 0) {
    return (
      <p className="task-list__empty">
        Завдань поки немає.
        <br />
        Додайте перше навчальне завдання.
      </p>
    )
  }

  // Завдання є, але жодне не підходить під обраний фільтр
  if (visibleTasks.length === 0) {
    return <p className="task-list__empty">За цим фільтром завдань немає.</p>
  }

  return (
    <ul className="task-list">
      {visibleTasks.map((task) => (
        // key — стабільний id завдання, а не індекс у масиві
        <TaskItem key={task.id} task={task} />
      ))}
    </ul>
  )
}

export default TaskList
