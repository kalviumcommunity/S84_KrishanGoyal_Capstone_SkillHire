import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../Styles/NavbarDashboards.css';

const NavbarDashboards = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleRoleBasedNavigation = () => {
    switch (user?.role) {
      case 'client':
        navigate('/client');
        break;
      case 'go-worker':
        navigate('/go');
        break;
      case 'pro-worker':
        navigate('/pro');
        break;
      default:
        navigate('/dashboard');
    }
  };

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="dashboard-navbar">
      <div className="dashboard-navbar-container">
        <div className="dashboard-navbar-brand">
          <div
            className="dashboard-navbar-logo"
            onClick={handleRoleBasedNavigation}
          >
            SkillHire
          </div>
        </div>

        <div className="dashboard-navbar-links">
          <div
            className="dashboard-navbar-link"
            onClick={handleRoleBasedNavigation}
          >
            Home
          </div>

          {user?.role === 'go-worker' && (
            <Link to="/go-projects" className="dashboard-navbar-link">
              All Projects (Go)
            </Link>
          )}

          {user?.role === 'pro-worker' && (
            <Link to="/pro-projects" className="dashboard-navbar-link">
              All Projects (Pro)
            </Link>
          )}

          {user?.role === 'client' && (
            <Link to="/your-projects" className="dashboard-navbar-link">
              Your Projects
            </Link>
          )}

          {(user?.role === 'go-worker' || user?.role === 'pro-worker') && (
            <Link to="/completed-tasks" className="dashboard-navbar-link">
              Completed Tasks
            </Link>
          )}

          <div className="dashboard-profile-container" ref={dropdownRef}>
            <button
              className="dashboard-profile-button"
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            >
              <span className="dashboard-profile-name">
                {user?.fullName || user?.email}
              </span>
              {user?.profileImageUrl ? (
                <img
                  src={user.profileImageUrl}
                  alt="Profile"
                  className="dashboard-profile-avatar"
                />
              ) : (
                <div className="dashboard-profile-avatar-placeholder">
                  {user?.fullName?.charAt(0) || user?.email?.charAt(0)}
                </div>
              )}
            </button>

            {showProfileDropdown && (
              <div className="dashboard-profile-dropdown">
                <Link
                  to="/profile"
                  className="dashboard-dropdown-item"
                  onClick={() => setShowProfileDropdown(false)}
                >
                  View Profile
                </Link>
                <button
                  className="dashboard-dropdown-item dashboard-logout-button"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavbarDashboards;