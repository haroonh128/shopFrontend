import { HashRouter } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './auth/context/AuthContext';
import { ThemeProvider } from './core/theme';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        {/* HashRouter avoids 404 on refresh when the host has no SPA fallback */}
        <HashRouter>
          <AppRoutes />
        </HashRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
