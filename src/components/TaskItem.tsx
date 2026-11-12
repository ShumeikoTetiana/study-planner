import { useState } from 'react'
import { useTaskContext } from '../hooks/useTaskContext'
import { PRIORITY_LABELS, type Task } from '../types/task'
import TaskForm from './TaskForm'
import './TaskItem.scss'

interface TaskItemProps {
  task: Task
}

// Одне завдання у списку. Саме завдання приходить через props від TaskList,
// а дії (виконати, видалити) беруться з Context
function TaskItem({ task }: TaskItemProps) {
  const { toggleTask, requestDelete, pendingDelete } = useTaskContext()
  // Локальний стан: чи відкрита форма редагування саме цього завдання
  const [isEditing, setIsEditing] = useState(false)

  // Завдання чекає на остаточне видалення (йде 5-секундний таймер)
  const isPending = pendingDelete?.ids.includes(task.id) ?? false

  if (isEditing) {
    return (
      <li className="task-item task-item--editing">
        <TaskForm task={task} onDone={() => setIsEditing(false)} />
      </li>
    )
  }

  const modifiers = [
    task.completed ? 'task-item--completed' : '',
    isPending ? 'task-item--pending' : '',
  ].join(' ')

  return (
    <li className={`task-item ${modifiers}`}>
      <div className="task-item__body">
        <h3 className="task-item__title">{task.title}</h3>

        {task.description && <p className="task-item__description">{task.description}</p>}

        <div className="task-item__meta">
          <span className="task-item__badge">{task.category}</span>
          <span className={`task-item__badge task-item__badge--${task.priority}`}>
            {PRIORITY_LABELS[task.priority]}
          </span>
          <span className="task-item__status">
            {isPending ? 'Буде видалено…' : task.completed ? '✔ Виконано' : 'Не виконано'}
          </span>
        </div>
      </div>

      {/* Поки завдання чекає на видалення, кнопки ховаємо — скасувати можна в toast */}
      {!isPending && (
        <div className="task-item__actions">
          <button
            type="button"
            className="task-item__button task-item__button--toggle"
            onClick={() => toggleTask(task.id)}
          >
            {task.completed ? 'Повернути' : 'Виконано'}
          </button>
          <button
            type="button"
            className="task-item__button task-item__button--edit"
            onClick={() => setIsEditing(true)}
          >
            Редагувати
          </button>
          <button
            type="button"
            className="task-item__button task-item__button--delete"
            onClick={() => requestDelete(task.id)}
          >
            Видалити
          </button>
        </div>
      )}
    </li>
  )
}

export default TaskItem
