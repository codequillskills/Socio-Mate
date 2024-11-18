import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.profilePicture && !parsedUser.profilePicture.startsWith('http')) {
        parsedUser.profilePicture = `http://localhost:5000${parsedUser.profilePicture}`;
      }
      setUser(parsedUser);
    }
    setLoading(false);
  }, []);

  const updateUserData = (userData) => {
    if (userData.profilePicture && !userData.profilePicture.startsWith('http')) {
      userData.profilePicture = `http://localhost:5000${userData.profilePicture}`;
    }
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const login = async (email, password) => {
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });
      updateUserData(data);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
      };
    }
  };

  const register = async (username, email, password) => {
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/register', {
        username,
        email,
        password,
      });
      updateUserData(data);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed',
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, updateUserData }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext); 