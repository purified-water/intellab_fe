import React from 'react';
import './App.css';
import { HomePage } from '@/pages/HomePage';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { LoginPage } from '@/features/Auth/pages/LoginPage';
import { SignUpPage } from './features/Auth/pages/SignUpPage';

// Temporary router
const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />
  },
  // Authentication paths
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/signup',
    element: <SignUpPage />
  }
]);

function App() {
  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}

export default App;
