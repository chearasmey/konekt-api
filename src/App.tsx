import { MainLayout } from './components/layout/MainLayout'
import { ThemeProvider } from './components/theme/ThemeProvider'
import { ThemeToggle } from './components/theme/ThemeToggle'
import { ErrorBoundary } from './components/error/ErrorBoundary'
import { ToastProvider } from './components/ui/toast'

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <div className="min-h-screen bg-background">
            <div className="fixed top-4 right-4">
              <ThemeToggle />
            </div>
            <MainLayout />
          </div>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App
