import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../Styles/ProfilePage.css";

const ProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

    const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="profile-container">
      <button className="profile-back-button" onClick={handleGoBack}>
        <i className="fas fa-arrow-left"></i> Back
      </button>
      <div className="profile-header">
        <div className="profile-avatar-container">
          {user?.profileImageUrl ? (
            <img
              src={user.profileImageUrl}
              alt="Profile"
              className="profile-avatar"
            />
          ) : (
            <div className="profile-avatar-placeholder">
              {user?.fullName?.charAt(0) || user?.email?.charAt(0)}
            </div>
          )}
          <button className="edit-avatar-btn">
            <i className="fas fa-camera"></i>
          </button>
        </div>
        <h1 className="profile-name">{user?.fullName || "Your Name"}</h1>
        <p className="profile-role">
          {user?.role === "client" && "Client"}
          {user?.role === "go-worker" && "Go-Worker"}
          {user?.role === "pro-worker" && "Pro-Worker"}
        </p>
      </div>

      <div className="profile-content">
        <div className="profile-section profile-info">
          <h2 className="section-title">Personal Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Email</span>
              <span className="info-value">
                {user?.email || "email@example.com"}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Phone</span>
              <span className="info-value">
                {user?.phone || "+1 (123) 456-7890"}
              </span>
            </div>

            {(user?.role === "go-worker" || user?.role === "pro-worker") && (
              <div className="info-item">
                <span className="info-label">Location</span>
                <span className="info-value">
                  {user?.location || "City, Country"}
                </span>
              </div>
            )}

            <div className="info-item">
              <span className="info-label">Member Since</span>
              <span className="info-value">
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("en-GB")
                  : "01-01-2023"}
              </span>
            </div>
          </div>
          <button className="edit-profile-btn">Edit Profile</button>
        </div>

        <div className="profile-section profile-skills">
          {user?.role === "client" ? (
            <>
              <h2 className="section-title">What Skills Do You Need?</h2>
              <div className="skills-container">
                {user?.requiredSkills?.length > 0 ? (
                  user.requiredSkills.map((skill, index) => (
                    <span key={index} className="skill-tag">
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="no-skills">
                    No specific requirements added yet
                  </p>
                )}
              </div>
              <button className="add-skills-btn">+ Add Requirements</button>
            </>
          ) : (
            <>
              <h2 className="section-title">Skills & Expertise</h2>
              <div className="skills-container">
                {user?.skills?.length > 0 ? (
                  user.skills.map((skill, index) => (
                    <span key={index} className="skill-tag">
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="no-skills">No skills added yet</p>
                )}
              </div>
              <button className="add-skills-btn">+ Add Skills</button>
            </>
          )}
        </div>

        <div className="profile-section profile-stats">
          {user?.role === "client" ? (
            <>
              <h2 className="section-title">Client Statistics</h2>
              <div className="stats-grid">
                <div className="stat-card">
                  <span className="stat-number">
                    {user?.postedJobs.length || "0"}
                  </span>
                  <span className="stat-label">Projects Posted</span>
                </div>
                <div className="stat-card">
                  <span className="stat-number">
                    {user?.projectsCompleted || "0"}
                  </span>
                  <span className="stat-label">Projects Completed</span>
                </div>
                <div className="stat-card">
                  <span className="stat-number">
                    {user?.satisfactionRate || "0%"}
                  </span>
                  <span className="stat-label">Satisfaction Rate</span>
                </div>
              </div>
            </>
          ) : (
            <>
              <h2 className="section-title">Work Statistics</h2>
              <div className="stats-grid">
                <div className="stat-card">
                  <span className="stat-number">
                    {user?.completedProjects || "0"}
                  </span>
                  <span className="stat-label">Completed Projects</span>
                </div>
                <div className="stat-card">
                  <span className="stat-number">
                    {user?.successRate || "0%"}
                  </span>
                  <span className="stat-label">Success Rate</span>
                </div>
                <div className="stat-card">
                  <span className="stat-number">
                    {user?.averageRating || "0.0"}
                  </span>
                  <span className="stat-label">Avg. Rating</span>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="profile-section profile-bio">
          {user?.role === "client" ? (
            <>
              <h2 className="section-title">
                What do you expect from the workers
              </h2>
              <p className="bio-text">
                {user?.description ||
                  "Share what kind of projects you typically need help with and any preferences you have for workers."}
              </p>
              <button className="edit-bio-btn">Edit Description</button>
            </>
          ) : (
            <>
              <h2 className="section-title">Professional Bio</h2>
              <p className="bio-text">
                {user?.bio ||
                  "Describe your professional experience, expertise, and what makes you stand out."}
              </p>
              <button className="edit-bio-btn">Edit Bio</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
