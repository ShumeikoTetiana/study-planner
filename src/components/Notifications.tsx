import { useTaskContext } from '../hooks/useTaskContext'
import Toast from './Toast'
import './Notifications.scss'

// Місце в куті екрана для коротких повідомлень success / error
function Notifications() {
  const { toast, hideToast } = useTaskContext()

  return (
    <div className="notifications">
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
