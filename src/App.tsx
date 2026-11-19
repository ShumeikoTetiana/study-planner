import Header from './components/Header'
import Notifications from './components/Notifications'
import Pagination from './components/Pagination'
import TaskDetails from './components/TaskDetails'
import TaskFilters from './components/TaskFilters'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'
import TaskStats from './components/TaskStats'
import { TaskProvider } from './context/TaskProvider'
import { useTaskContext } from './hooks/useTaskContext'

// Вміст сторінки: або деталі вибраного завдання, або список
function Content() {
  const { selectedTaskId, closeDetails } = useTaskContext()

  if (selectedTaskId !== null) {
    // key — щоб при відкритті іншого завдання компонент створювався заново
    return <TaskDetails key={selectedTaskId} id={selectedTaskId} onClose={closeDetails} />
  }

  return (
    <>
      <TaskForm />
      <TaskStats />
      <TaskFilters />
      <TaskList />
      <Pagination />
    </>
  )
}

function App() {
  return (
    <TaskProvider>
      <div className="app">
        <Header />
        <main className="app__content">
          <Content />
        </main>
        <Notifications />
      </div>
    </TaskProvider>
  )
}

export default App
