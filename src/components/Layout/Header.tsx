import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User, LogOut, Menu, Bell } from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <button onClick={onMenuClick} className="mr-4 text-gray-600 hover:text-gray-800">
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-bold text-gray-800">
            My App
          </h1>
        </div>
        <div className="flex items-center">
          <Bell className="h-6 w-6 text-gray-600 mr-4" />
          <User className="h-6 w-6 text-gray-600 mr-4" />
          <button onClick={logout} className="text-gray-600 hover:text-gray-800">
            <LogOut className="h-6 w-6" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header; 