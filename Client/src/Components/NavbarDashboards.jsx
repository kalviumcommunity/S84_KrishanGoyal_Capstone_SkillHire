import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../Styles/NavbarDashboards.css";

const NavbarDashboards = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleRoleBasedNavigation = () => {
    switch (user?.role) {
      case "client":
        navigate("/client");
        break;
      case "go-worker":
        navigate("/go");
        break;
      case "pro-worker":
        navigate("/pro");
        break;
      default:
        navigate("/dashboard");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
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

          {user?.role === "go-worker" && (
            <>
              <div
                className="dashboard-navbar-link"
                onClick={() => navigate("/all-go-projects")}
              >
                All Projects
              </div>
              <div
                className="dashboard-navbar-link"
                onClick={() => navigate("/active-go-projects")}
              >
                Active Projects
              </div>
              <div
                className="dashboard-navbar-link"
                onClick={() => navigate("/completed-tasks")}
              >
                Completed Tasks
              </div>
            </>
          )}

          {user?.role === "pro-worker" && (
            <>
              <div
                className="dashboard-navbar-link"
                onClick={() => navigate("/pro-projects")}
              >
                All Projects (Pro)
              </div>
              <div
                className="dashboard-navbar-link"
                onClick={() => navigate("/applied-projects")}
              >
                Applied
              </div>
            </>
          )}

          {user?.role === "client" && (
            <>
              <div
                className="dashboard-navbar-link"
                onClick={() => navigate("/your-projects")}
              >
                Your Projects
              </div>
              <div
                className="dashboard-navbar-link"
                onClick={() => navigate("/pending-confirmation")}
              >
                Pending Confirmation
              </div>
              <div
                className="dashboard-navbar-link"
                onClick={() => navigate("/closed-projects")}
              >
                Closed Projects
              </div>
            </>
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
                <div
                  className="dashboard-dropdown-item"
                  onClick={() => {
                    navigate("/profile");
                    setShowProfileDropdown(false);
                  }}
                >
                  View Profile
                </div>
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
