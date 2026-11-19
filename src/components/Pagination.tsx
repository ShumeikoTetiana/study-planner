import { useTaskContext } from '../hooks/useTaskContext'
import './Pagination.scss'

// Перемикання сторінок. Поточна сторінка — client state, сам запит робить useTasks
function Pagination() {
  const { page, totalPages, goToPage, status } = useTaskContext()

  return (
    <nav className="pagination">
      <button
        type="button"
        className="pagination__button"
        disabled={page <= 1}
        onClick={() => goToPage(page - 1)}
      >
        ← Попередня
      </button>

      <span className="pagination__info">
        Сторінка {page} з {status === 'error' ? '?' : totalPages}
      </span>

      <button
        type="button"
        className="pagination__button"
        disabled={page >= totalPages}
        onClick={() => goToPage(page + 1)}
      >
        Наступна →
      </button>
    </nav>
  )
}

export default Pagination
