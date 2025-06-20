import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Icon } from 'lucide-react';
import Float from '../components/Float';

const MainLayout = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('isAuthenticated') === 'true');

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(localStorage.getItem('isAuthenticated') === 'true');
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <div className="flex">
      {isAuthenticated && <Sidebar />}
      <div className="flex-1">
        <Outlet />
      </div>
      { isAuthenticated && <Float />}
    </div>
  );
};

export default MainLayout;
