import { useState, type FormEvent } from 'react'
import { useTaskContext } from '../hooks/useTaskContext'
import { PRIORITY_LABELS, type Task } from '../types/task'
import './TaskItem.scss'

interface TaskItemProps {
  task: Task
}

// Одне завдання у списку: перемикання completed, зміна назви, видалення з підтвердженням
function TaskItem({ task }: TaskItemProps) {
  const { toggleTask, renameTask, deleteTask, openDetails } = useTaskContext()

  // Локальний UI state цієї картки
  const [mode, setMode] = useState<'view' | 'edit' | 'confirm'>('view')
  const [title, setTitle] = useState(task.title)
  const [isBusy, setIsBusy] = useState(false) // йде запит — кнопки неактивні

  // Обгортка: поки запит виконується — блокуємо кнопки
  async function run(action: () => Promise<boolean>) {
    setIsBusy(true)
    const ok = await action()
    setIsBusy(false)
    return ok
  }

  async function handleRename(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const newTitle = title.trim()
    if (!newTitle) return
    const ok = await run(() => renameTask(task, newTitle))
    if (ok) setMode('view')
  }

  // Режим редагування назви
  if (mode === 'edit') {
    return (
      <li className="task-item">
        <form className="task-item__edit" onSubmit={handleRename}>
          <input
            className="task-item__input"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            autoFocus
          />
          <button type="submit" className="task-item__button task-item__button--toggle" disabled={isBusy}>
            {isBusy ? '…' : 'Зберегти'}
          </button>
          <button
            type="button"
            className="task-item__button task-item__button--edit"
            onClick={() => {
              setTitle(task.title)
              setMode('view')
            }}
          >
            Скасувати
          </button>
        </form>
      </li>
    )
  }

  return (
    <li className={`task-item ${task.completed ? 'task-item--completed' : ''}`}>
      <div className="task-item__body">
        <button type="button" className="task-item__title" onClick={() => openDetails(task.id)}>
          {task.title}
        </button>

        {task.description && <p className="task-item__description">{task.description}</p>}

        <div className="task-item__meta">
          <span className="task-item__badge">{task.category}</span>
          <span className={`task-item__badge task-item__badge--${task.priority}`}>
            {PRIORITY_LABELS[task.priority]}
          </span>
          <span className="task-item__status">{task.completed ? '✔ Виконано' : 'Не виконано'}</span>
        </div>
      </div>

      {/* Підтвердження видалення прямо в картці */}
      {mode === 'confirm' ? (
        <div className="task-item__confirm">
          <span className="task-item__confirm-text">Видалити завдання?</span>
          <button
            type="button"
            className="task-item__button task-item__button--delete"
            disabled={isBusy}
            onClick={() => run(() => deleteTask(task))}
          >
            {isBusy ? '…' : 'Так'}
          </button>
          <button
            type="button"
            className="task-item__button task-item__button--edit"
            onClick={() => setMode('view')}
          >
            Ні
          </button>
        </div>
      ) : (
        <div className="task-item__actions">
          <button
            type="button"
            className="task-item__button task-item__button--toggle"
            disabled={isBusy}
            onClick={() => run(() => toggleTask(task))}
          >
            {isBusy ? '…' : task.completed ? 'Повернути' : 'Виконано'}
          </button>
          <button
            type="button"
            className="task-item__button task-item__button--edit"
            onClick={() => setMode('edit')}
          >
            Редагувати
          </button>
          <button
            type="button"
            className="task-item__button task-item__button--delete"
            onClick={() => setMode('confirm')}
          >
            Видалити
          </button>
        </div>
      )}
    </li>
  )
}

export default TaskItem
