import { useState, type ChangeEvent, type FormEvent } from 'react'
import { useTaskContext } from '../hooks/useTaskContext'
import { PRIORITY_LABELS, type NewTask, type Priority } from '../types/task'
import './TaskForm.scss'

// Порожня форма — з неї стартуємо і до неї повертаємось після створення
const EMPTY_FORM: NewTask = {
  title: '',
  description: '',
  category: '',
  priority: 'medium',
}

const PRIORITIES: Priority[] = ['low', 'medium', 'high']

// Форма створення завдання. Відправляє дані через addTask → repository → POST
function TaskForm() {
  const { addTask } = useTaskContext()
  const [form, setForm] = useState<NewTask>(EMPTY_FORM)
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))

    if (name === 'title' && value.trim()) {
      setError('')
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const title = form.title.trim()
    if (!title) {
      setError('Введіть назву завдання')
      return
    }

    setIsSaving(true)
    const ok = await addTask({
      title,
      description: form.description.trim(),
      category: form.category.trim() || 'General',
      priority: form.priority,
    })
    setIsSaving(false)

    // Очищуємо форму лише після успішного створення
    if (ok) {
      setForm(EMPTY_FORM)
      setError('')
    }
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
          placeholder="Наприклад: Вивчити fetch"
        />
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

      <div className="task-form__actions">
        <button type="submit" className="task-form__submit" disabled={isSaving}>
          {isSaving ? 'Збереження…' : 'Додати'}
        </button>
      </div>
    </form>
  )
}

export default TaskForm
