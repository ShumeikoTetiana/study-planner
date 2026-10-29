import type { Task } from '../types/task'
import TaskItem from './TaskItem'
import './TaskList.scss'

interface TaskListProps {
  tasks: Task[] // завдання, які треба показати (вже відфільтровані)
  hasAnyTasks: boolean // чи є взагалі хоч одне завдання (без фільтра)
  onToggle: (id: number) => void
  onDelete: (id: number) => void
}

// Список завдань. Показує або повідомлення, або елементи списку через map
function TaskList({ tasks, hasAnyTasks, onToggle, onDelete }: TaskListProps) {
  // Умовний рендеринг: завдань немає зовсім
  if (!hasAnyTasks) {
    return (
      <p className="task-list__empty">
        Завдань поки немає.
        <br />
        Додайте перше навчальне завдання.
      </p>
    )
  }

  // Завдання є, але жодне не підходить під обраний фільтр
  if (tasks.length === 0) {
    return <p className="task-list__empty">За цим фільтром завдань немає.</p>
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        // key — стабільний id завдання, а не індекс у масиві
        <TaskItem key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} />
      ))}
    </ul>
  )
}

export default TaskList
