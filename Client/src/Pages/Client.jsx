import React from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export default function Client() {
  const navigate = useNavigate();

  useEffect(() => {
    window.history.pushState(null, '', window.location.href);
    const onPopState = () => {
      window.history.pushState(null, '', window.location.href);
    };
    window.addEventListener('popstate', onPopState);

    return () => {
      window.removeEventListener('popstate', onPopState);
    };
  }, []);

const handleLogout = async () => {
    try {
      await axios.post(`${baseUrl}/api/auth/logout`, {}, {
        withCredentials: true
      });

      localStorage.removeItem('authToken');
      localStorage.removeItem('user');

      sessionStorage.clear();

      navigate('/', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      localStorage.clear();
      sessionStorage.clear();
      navigate('/', { replace: true });
    }
  };

  return (
    <div>
      <h1>Welcome to Client Dashboard</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}
