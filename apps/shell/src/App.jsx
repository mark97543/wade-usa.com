import { BrowserRouter as Router } from 'react-router-dom';
import { Header } from '@repo/ui';
import { HomePage } from '@wade-usa/feature-home';
import { AuthProvider } from '@wade-usa/auth';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Header />
        <main>
          <HomePage />
        </main>
      </AuthProvider>
    </Router>
  );
}

export default App;