import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../Styles/ProfilePage.css";

const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  // Profile modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({
    fullName: user?.fullName || "",
    phone: user?.phone || "",
    description: user?.description || "",
  });

  // Description modal
  const [showEditDescriptionModal, setShowEditDescriptionModal] = useState(false);
  const [descriptionInput, setDescriptionInput] = useState(user?.description || "");

  // Skills modal
  const [showEditSkillsModal, setShowEditSkillsModal] = useState(false);
  const [skillsInput, setSkillsInput] = useState(user?.requiredSkills || []);
  const [newSkill, setNewSkill] = useState("");

  // Shared
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleGoBack = () => {
    navigate(-1);
  };

  // Profile edit
  const handleEditProfile = () => {
    setEditData({
      fullName: user?.fullName || "",
      phone: user?.phone || "",
      description: user?.description || "",
    });
    setShowEditModal(true);
    setError("");
    setSuccessMsg("");
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMsg("");
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      const res = await axios.put(
        `${baseUrl}/api/auth/users/${user._id}`,
        editData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      setUser(res.data.data);
      setSuccessMsg("Profile updated successfully!");
      setTimeout(() => {
        setShowEditModal(false);
        setSuccessMsg("");
      }, 1200);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to update profile"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
    setError("");
    setSuccessMsg("");
  };

  // Description edit
  const handleEditDescription = () => {
    setDescriptionInput(user?.description || "");
    setShowEditDescriptionModal(true);
    setError("");
    setSuccessMsg("");
  };

  const handleSaveDescription = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMsg("");
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      const res = await axios.put(
        `${baseUrl}/api/auth/users/${user._id}`,
        { description: descriptionInput },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      setUser(res.data.data);
      setSuccessMsg("Description updated!");
      setTimeout(() => {
        setShowEditDescriptionModal(false);
        setSuccessMsg("");
      }, 1000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to update description"
      );
    } finally {
      setLoading(false);
    }
  };

  // Skills/requirements edit
  const handleEditSkills = () => {
    setSkillsInput(user?.requiredSkills || []);
    setShowEditSkillsModal(true);
    setError("");
    setSuccessMsg("");
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !skillsInput.includes(newSkill.trim())) {
      setSkillsInput([...skillsInput, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skill) => {
    setSkillsInput(skillsInput.filter((s) => s !== skill));
  };

  const handleSaveSkills = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMsg("");
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      const res = await axios.put(
        `${baseUrl}/api/auth/users/${user._id}`,
        { requiredSkills: skillsInput },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      setUser(res.data.data);
      setSuccessMsg("Requirements updated!");
      setTimeout(() => {
        setShowEditSkillsModal(false);
        setSuccessMsg("");
      }, 1000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to update requirements"
      );
    } finally {
      setLoading(false);
    }
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
                  {user?.location?.city
                    ? `${user.location.city}${
                        user.location.subCity
                          ? ", " + user.location.subCity
                          : ""
                      }`
                    : "City, Country"}
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
          <button className="edit-profile-btn" onClick={handleEditProfile}>
            Edit Profile
          </button>
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
              <button className="add-skills-btn" onClick={handleEditSkills}>
                + Add Requirements
              </button>
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
                    {user?.postedJobs?.length || "0"}
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
              <button className="edit-bio-btn" onClick={handleEditDescription}>
                Edit Description
              </button>
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

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="edit-modal">
            <h2>Edit Profile</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={editData.fullName}
                  onChange={handleEditChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={editData.phone}
                  onChange={handleEditChange}
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={editData.description}
                  onChange={handleEditChange}
                />
              </div>
              {error && !successMsg && (
                <div className="error-message">{error}</div>
              )}
              {successMsg && (
                <div className="success-message">{successMsg}</div>
              )}
              <div className="form-actions">
                <button type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Description Modal */}
      {showEditDescriptionModal && (
        <div className="modal-overlay">
          <div className="edit-modal">
            <h2>Edit Description</h2>
            <form onSubmit={handleSaveDescription}>
              <textarea
                value={descriptionInput}
                onChange={(e) => setDescriptionInput(e.target.value)}
                required
              />
              {error && !successMsg && <div className="error-message">{error}</div>}
              {successMsg && <div className="success-message">{successMsg}</div>}
              <div className="form-actions">
                <button type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditDescriptionModal(false)}
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Skills/Requirements Modal */}
      {showEditSkillsModal && (
        <div className="modal-overlay">
          <div className="edit-modal">
            <h2>Edit Requirements</h2>
            <form onSubmit={handleSaveSkills}>
              <div className="skills-edit-list">
                {skillsInput.map((skill, idx) => (
                  <span key={idx} className="skill-tag">
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      style={{
                        marginLeft: 6,
                        color: "#e74c3c",
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                      }}
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
              <div style={{ display: "flex", gap: 8, margin: "12px 0" }}>
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add requirement"
                />
                <button type="button" onClick={handleAddSkill}>
                  Add
                </button>
              </div>
              {error && !successMsg && <div className="error-message">{error}</div>}
              {successMsg && <div className="success-message">{successMsg}</div>}
              <div className="form-actions">
                <button type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditSkillsModal(false)}
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
