import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { isDarkMode, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleAuthAction = () => {
    if (user) {
      logout();
      navigate('/login');
    } else {
      navigate('/login');
    }
  };

  return (
    <nav className="border-b dark:border-gray-700 border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold hover:text-primary-light dark:hover:text-primary-dark">
              Social App
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {user && (
              <Link 
                to={`/profile/${user._id}`}
                className="text-gray-600 hover:text-primary-light dark:text-gray-300 dark:hover:text-primary-dark"
              >
                Profile
              </Link>
            )}
            <button
              onClick={toggleTheme}
              className="btn-secondary"
            >
              {isDarkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
            </button>
            <button 
              onClick={handleAuthAction} 
              className="btn-primary"
            >
              {user ? 'Sign Out' : 'Sign In'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
} 