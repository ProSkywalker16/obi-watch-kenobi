import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import Home from '../pages/Home';
import MainLayout from '../layout/MainLayout';
// import Database from '../pages/Database';
import Settings from '../pages/Settings';
import Login from '../pages/Login';
//import IPInfo from '../pages/IPInfo';
import React from 'react';
//import Chatbot from '../pages/Chatbot';

// Route guard component
const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  return isAuthenticated ? children : <Navigate to="/" replace />;
};

const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/dashboard',
        element: (
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        )
      },
      {
        path: '/settings',
        element: (
          <PrivateRoute>
            <Settings />
          </PrivateRoute>
        )
      },
      /*{
        path: '/chatbot',
        element: (
          <PrivateRoute>
            <Chatbot />
          </PrivateRoute>
        )
      },
      
      {
        path: '/log_storage/ipinfo/:ip',
        element: (
          <PrivateRoute>
            <IPInfo />
          </PrivateRoute>
        )
      }*/
    ]
	},
  {
    path: '/login',
    element: <Login />
  }
]);


function App() {
  return (
    <main>
      <RouterProvider router={appRouter} />
    </main>
  );
}

export default App;
