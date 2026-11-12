import { UNDO_DELAY } from '../context/TaskContext'
import { useTaskContext } from '../hooks/useTaskContext'
import Toast from './Toast'
import './Notifications.scss'

// Місце в куті екрана, де з'являються сповіщення.
// Тут два види toast: «буде видалено» з кнопкою Undo і звичайне повідомлення
function Notifications() {
  const { tasks, pendingDelete, undoDelete, toast, hideToast } = useTaskContext()

  let pendingMessage = ''
  if (pendingDelete) {
    const count = pendingDelete.ids.length
    const task = tasks.find((item) => item.id === pendingDelete.ids[0])
    pendingMessage =
      count === 1 && task
        ? `Завдання «${task.title}» буде видалено`
        : `Буде видалено виконаних завдань: ${count}`
  }

  return (
    <div className="notifications">
      {pendingDelete && (
        <Toast
          // новий key при новому видаленні — смужка прогресу починається спочатку
          key={pendingDelete.ids.join('-')}
          message={pendingMessage}
          type="info"
          duration={UNDO_DELAY}
          actionLabel="Скасувати"
          onAction={undoDelete}
        />
      )}
      {toast && (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={3000}
          onClose={hideToast}
        />
      )}
    </div>
  )
}

export default Notifications
