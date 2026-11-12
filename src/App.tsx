import Header from './components/Header'
import Notifications from './components/Notifications'
import TaskFilters from './components/TaskFilters'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'
import TaskStats from './components/TaskStats'
import { TaskProvider } from './context/TaskProvider'

// Головний компонент тепер лише складає сторінку.
// Увесь стан і логіка — у TaskProvider, компоненти беруть їх через useTaskContext()
function App() {
  return (
    <TaskProvider>
      <div className="app">
        <Header />

        <main className="app__content">
          <TaskForm />
          <TaskStats />
          <TaskFilters />
          <TaskList />
        </main>

        <Notifications />
      </div>
    </TaskProvider>
  )
}

export default App
