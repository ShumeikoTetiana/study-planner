import { useEffect } from 'react'
import type { ToastType } from '../context/TaskContext'
import './Toast.scss'

interface ToastProps {
  message: string
  type: ToastType
  duration: number // скільки мс показувати (і скільки йде смужка прогресу)
  onClose?: () => void // якщо передано — toast сам закриється через duration
  actionLabel?: string // підпис кнопки дії, наприклад «Скасувати»
  onAction?: () => void
}

// Власний компонент сповіщення без сторонніх бібліотек
function Toast({ message, type, duration, onClose, actionLabel, onAction }: ToastProps) {
  // Автоматичне зникнення: таймер, який очищується, якщо toast зник раніше
  useEffect(() => {
    if (!onClose) return
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [onClose, duration])

  return (
    <div className={`toast toast--${type}`} role="status">
      <div className="toast__body">
        <span className="toast__message">{message}</span>
        {actionLabel && onAction && (
          <button type="button" className="toast__action" onClick={onAction}>
            {actionLabel}
          </button>
        )}
      </div>
      {/* Смужка прогресу: зменшується від повної до нуля за duration (CSS-анімація) */}
      <div className="toast__progress" style={{ animationDuration: `${duration}ms` }} />
    </div>
  )
}

export default Toast
