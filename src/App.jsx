import { BrowserRouter as Router } from 'react-router-dom'

function App() {
  return (
    <Router basename="/Architecture-Bulletin">
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Architecture Bulletin
            </h1>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
              <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
                <p className="text-gray-500 text-lg">
                  Welcome to Architecture Bulletin! 🎯
                  <br />
                  <span className="text-sm">
                    Project structure is ready. The Developer Agent will build
                    the features.
                  </span>
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </Router>
  )
}

export default App
