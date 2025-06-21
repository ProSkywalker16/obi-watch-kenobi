import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Float from '../components/Float';

const MainLayout = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('isAuthenticated') === 'true');
  const location = useLocation();

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(localStorage.getItem('isAuthenticated') === 'true');
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const isHomePage = location.pathname === '/';

  return (
    <div className="flex">
      {isAuthenticated && !isHomePage && <Sidebar />}
      <div className="flex-1">
        <Outlet />
      </div>
      {isAuthenticated && !isHomePage && <Float />}
    </div>
  );
};

export default MainLayout;
