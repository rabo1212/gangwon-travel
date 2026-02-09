import GangwonTravelApp from './GangwonTravelApp'
import ErrorBoundary from './components/ui/ErrorBoundary'
import './index.css'

function App() {
  return (
    <ErrorBoundary onReset={() => window.location.reload()}>
      <GangwonTravelApp />
    </ErrorBoundary>
  )
}

export default App
