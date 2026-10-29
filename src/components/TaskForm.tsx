import { useState, type ChangeEvent, type FormEvent } from 'react'
import { PRIORITY_LABELS, type NewTask, type Priority } from '../types/task'
import './TaskForm.scss'

interface TaskFormProps {
  onAdd: (task: NewTask) => void
}

// Порожня форма — з неї стартуємо і до неї повертаємось після додавання
const EMPTY_FORM: NewTask = {
  title: '',
  description: '',
  category: '',
  priority: 'medium',
}

const PRIORITIES: Priority[] = ['low', 'medium', 'high']

// Форма додавання завдання.
// Значення полів зберігаються у локальному стані форми (useState),
// а готове завдання передається батьку через callback onAdd
function TaskForm({ onAdd }: TaskFormProps) {
  const [form, setForm] = useState<NewTask>(EMPTY_FORM)
  const [error, setError] = useState('')

  // Один обробник для всіх полів: беремо name поля і його нове значення.
  // Створюємо НОВИЙ об'єкт через spread, а не змінюємо старий
  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))

    // Користувач почав вводити назву — ховаємо помилку
    if (name === 'title' && value.trim()) {
      setError('')
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    // Без цього браузер перезавантажив би сторінку
    event.preventDefault()

    const title = form.title.trim()
    if (!title) {
      setError('Введіть назву завдання')
      return
    }

    onAdd({
      title,
      description: form.description.trim(),
      category: form.category.trim() || 'Загальне',
      priority: form.priority,
    })

    // Очищуємо форму після успішного додавання
    setForm(EMPTY_FORM)
    setError('')
  }

  return (
    <form className="task-form" onSubmit={handleSubmit} noValidate>
      <h2 className="task-form__heading">Нове завдання</h2>

      <label className="task-form__field">
        <span className="task-form__label">Назва *</span>
        <input
          className={`task-form__input ${error ? 'task-form__input--invalid' : ''}`}
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Наприклад: Вивчити props"
        />
        {/* Текст помилки показуємо лише коли вона є */}
        {error && <span className="task-form__error">{error}</span>}
      </label>

      <label className="task-form__field">
        <span className="task-form__label">Опис</span>
        <textarea
          className="task-form__input task-form__input--textarea"
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={2}
          placeholder="Коротко, що треба зробити"
        />
      </label>

      <div className="task-form__row">
        <label className="task-form__field">
          <span className="task-form__label">Категорія</span>
          <input
            className="task-form__input"
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="React, TypeScript…"
          />
        </label>

        <label className="task-form__field">
          <span className="task-form__label">Пріоритет</span>
          <select
            className="task-form__input"
            name="priority"
            value={form.priority}
            onChange={handleChange}
          >
            {PRIORITIES.map((priority) => (
              <option key={priority} value={priority}>
                {PRIORITY_LABELS[priority]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <button type="submit" className="task-form__submit">
        Додати
      </button>
    </form>
  )
}

export default TaskForm
