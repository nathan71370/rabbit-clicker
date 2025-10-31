import { CarrotClicker } from '@/components/clicker/CarrotClicker';

/**
 * Main App Component
 * Root component with basic layout for the clicker game MVP
 */
function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Game Title */}
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
            Rabbit Clicker
          </h1>

          {/* Clicker Section */}
          <div className="card">
            <CarrotClicker />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
