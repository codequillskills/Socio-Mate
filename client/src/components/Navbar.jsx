import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';

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
    <nav className="border-b dark:border-gray-700 border-gray-200 sticky top-0 bg-white dark:bg-gray-800 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link 
              to="/" 
              className="text-2xl font-bold bg-gradient-to-r from-primary-light to-secondary-light dark:from-primary-dark dark:to-secondary-dark bg-clip-text text-transparent hover:opacity-80 transition-opacity"
            >
              SocioMate
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {user && (
              <Link 
                to={`/profile/${user._id}`}
                className="flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-primary-light to-secondary-light dark:from-primary-dark dark:to-secondary-dark text-white hover:opacity-90 transition-all duration-200 transform hover:scale-105 shadow-md"
              >
                <FaUser className="w-4 h-4" />
                <span className="ml-2 font-medium">Profile</span>
              </Link>
            )}
            <button
              onClick={toggleTheme}
              className="btn-secondary transform hover:scale-105 transition-transform duration-200"
            >
              {isDarkMode ? '🌞 Light' : '🌙 Dark'}
            </button>
            <button 
              onClick={handleAuthAction} 
              className="btn-primary transform hover:scale-105 transition-transform duration-200"
            >
              {user ? 'Sign Out' : 'Sign In'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
} 