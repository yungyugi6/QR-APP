import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { QrCode, Layout, LogOut } from 'lucide-react';
import { useAuth } from './AuthContext';
import { Login } from './Login';

export const Navigation: React.FC = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);

  const handleSignOut = () => {
    signOut();
    navigate('/');
  };

  return (
    <>
      <nav className="bg-white shadow-sm relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="flex items-center">
              <QrCode className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-semibold">QR Generator</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      location.pathname === '/dashboard'
                        ? 'text-indigo-600 bg-indigo-50'
                        : 'text-gray-600 hover:text-indigo-600'
                    }`}
                  >
                    <Layout className="w-5 h-5" />
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-red-600"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowLogin(true)}
                  className="px-4 py-2 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Dashboard
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {showLogin && !user && (
        <Login onClose={() => setShowLogin(false)} />
      )}
    </>
  );
};