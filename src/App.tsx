// import React from 'react';
// import logo from './logo.svg';
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './auth/context/AuthContext';
// import { ThemeProvider } from 'styled-components';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    // <ThemeProvider>
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  // </ThemeProvider> 
  );
}

export default App;
