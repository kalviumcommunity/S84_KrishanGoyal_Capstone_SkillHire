import React from 'react'
import { useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import NavbarDashboards from '../Components/NavbarDashboards';

export default function ProDashboard() {
  const { user } = useAuth();

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

  return (
    <div>
      <NavbarDashboards />
      <h1>Welcome to Pro Dashboard</h1>
      {user ? (
        <h1>Hi {user.fullName || user.email}</h1>
      ) : (
        <h1>Loading...</h1>
      )}
    </div>
  )
}
