import { BrowserRouter as Router } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom'
import { Header } from '@repo/ui';
import { HomePage } from '@wade-usa/feature-home';
import { AuthProvider } from '@wade-usa/auth';
import {TravelMain} from '@wade-usa/feature-travel'


function App() {
  return (
    <Router>
      <AuthProvider>
        <Header />
        <Routes>
          <Route path="/travel/*" element={<TravelMain />} />
          <Route path="/*" element={<HomePage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;