// frontend/src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext'; // <-- 1. IMPORT

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter> {/* <-- 2. BrowserRouter MUST be on the OUTSIDE */}
      <AuthProvider> {/* <-- 3. AuthProvider is now INSIDE */}
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);