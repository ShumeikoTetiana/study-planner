import { useTaskDetails } from '../hooks/useTaskDetails'
import { PRIORITY_LABELS } from '../types/task'
import './TaskDetails.scss'

interface TaskDetailsProps {
  id: number
  onClose: () => void
}

// Деталі завдання. Актуальні дані отримує через taskRepository.getById (у хуку useTaskDetails)
function TaskDetails({ id, onClose }: TaskDetailsProps) {
  const { task, status, error, reload } = useTaskDetails(id)

  return (
    <section className="task-details">
      <button type="button" className="task-details__back" onClick={onClose}>
        ← Назад до списку
      </button>

      {status === 'loading' && <p className="task-details__state">Завантаження…</p>}

      {status === 'error' && (
        <div className="task-details__state task-details__state--error">
          <p>Не вдалося завантажити завдання: {error}</p>
          <button type="button" className="task-details__retry" onClick={reload}>
            Спробувати ще
          </button>
        </div>
      )}

      {status === 'success' && task && (
        <dl className="task-details__list">
          <dt className="task-details__term">Назва</dt>
          <dd className="task-details__value task-details__value--title">{task.title}</dd>

          <dt className="task-details__term">Опис</dt>
          <dd className="task-details__value">{task.description || '—'}</dd>

          <dt className="task-details__term">Категорія</dt>
          <dd className="task-details__value">{task.category}</dd>

          <dt className="task-details__term">Пріоритет</dt>
          <dd className="task-details__value">{PRIORITY_LABELS[task.priority]}</dd>

          <dt className="task-details__term">Статус</dt>
          <dd className="task-details__value">{task.completed ? '✔ Виконано' : 'Не виконано'}</dd>

          <dt className="task-details__term">ID</dt>
          <dd className="task-details__value">{task.id}</dd>
        </dl>
      )}
    </section>
  )
}

export default TaskDetails
