import './Header.scss'

// Шапка застосунку. Нічого не отримує і нічого не змінює — просто показує заголовок
function Header() {
  return (
    <header className="header">
      <h1 className="header__title">Study Planner</h1>
      <p className="header__subtitle">Планувальник навчальних завдань</p>
    </header>
  )
}

export default Header
