import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import NavbarDashboards from "../Components/NavbarDashboards";
import ConfirmModal from "../Components/ConfirmModal";
import "../Styles/ActiveGoProjects.css";
import "../Styles/ConfirmModal.css";

const ActiveGoProjects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [projectToMark, setProjectToMark] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    if (user?._id) {
      fetchActiveProjects();
    }
    // eslint-disable-next-line
  }, [user]);

  const fetchActiveProjects = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch active projects (assigned but not completed)
      const response = await axios.get(
        `${baseUrl}/api/go-projects/active/${user._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          withCredentials: true,
        }
      );

      setProjects(response.data.projects || []);
    } catch (error) {
      console.error("Error fetching active projects:", error);
      setError(
        error.response?.data?.message ||
          "Failed to load active projects. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Function to show the modal with the project ID
  const handleMarkCompleteClick = (projectId) => {
    setProjectToMark(projectId);
    setShowConfirmModal(true);
  };

  // Step 2: Function to handle the confirmation
  const handleConfirmMarkComplete = async () => {
    if (!projectToMark) return;
    
    try {
      await axios.put(
        `${baseUrl}/api/go-projects/${projectToMark}/mark-complete`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          withCredentials: true,
        }
      );

      // Update the project status locally
      setProjects((prev) =>
        prev.map((project) =>
          project._id === projectToMark
            ? { ...project, status: "pending confirmation" }
            : project
        )
      );
      
      // Show success message
      setSuccessMessage("Marked as complete! Waiting for client confirmation.");
      setTimeout(() => setSuccessMessage(""), 3000);
      
      // Close modal
      setShowConfirmModal(false);
      setProjectToMark(null);
    } catch (error) {
      console.error("Error marking project as complete:", error);
      alert("Failed to update project status. Please try again.");
      setShowConfirmModal(false);
      setProjectToMark(null);
    }
  };

  // Function to navigate to project details
  const viewProjectDetails = (projectId) => {
    window.location.href = `/go-projects/${projectId}`;
  };

  return (
    <div className="active-go-projects-page">
      <NavbarDashboards />

      <div className="page-container">
        <header className="page-header">
          <h1>Your Active Projects</h1>
          <p>Manage your ongoing projects and track progress</p>
        </header>

        {successMessage && (
          <div className="custom-success-alert">{successMessage}</div>
        )}

        {error && (
          <div className="error-message">
            {error}
            <button onClick={fetchActiveProjects}>Retry</button>
          </div>
        )}

        {loading ? (
          <div className="loading-spinner">Loading active projects...</div>
        ) : projects.length > 0 ? (
          <div className="projects-grid">
            {projects.map((project) => (
              <div key={project._id} className="project-card">
                <div className="project-header">
                  <h3>{project.title}</h3>
                  <span
                    className={`status-badge ${project.status.replace(
                      /\s+/g,
                      "-"
                    )}`}
                  >
                    {project.status.replace(/-/g, " ")}
                  </span>
                </div>

                <p className="project-description">{project.description}</p>

                <div className="project-details">
                  <div className="detail-item">
                    <span className="detail-label">Location:</span>
                    <span>
                      {project.city}
                      {project.subCity ? `, ${project.subCity}` : ""}
                    </span>
                  </div>

                  <div className="detail-item">
                    <span className="detail-label">Category:</span>
                    <span>{project.category}</span>
                  </div>

                  <div className="detail-item">
                    <span className="detail-label">Payment:</span>
                    <span>₹{project.payment?.toLocaleString() || "TBD"}</span>
                  </div>

                  <div className="detail-item">
                    <span className="detail-label">Client:</span>
                    <span>{project.postedBy?.fullName || "Client"}</span>
                  </div>

                  <div className="detail-item">
                    <span className="detail-label">Accepted on:</span>
                    <span>
                      {new Date(project.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="project-actions">
                  <button
                    className="action-button view-details"
                    onClick={() => viewProjectDetails(project._id)}
                  >
                    View Details
                  </button>
                  {project.status === "pending confirmation" ? (
                    <span className="pending-confirmation-msg">
                      Waiting for client confirmation...
                    </span>
                  ) : (
                    <button
                      className="action-button mark-complete"
                      onClick={() => handleMarkCompleteClick(project._id)}
                    >
                      Mark Complete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-projects">
            <p>You don't have any active projects.</p>
            <button
              className="find-projects-button"
              onClick={() => (window.location.href = "/all-go-projects")}
            >
              Find Projects
            </button>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        open={showConfirmModal}
        onClose={() => {
          setShowConfirmModal(false);
          setProjectToMark(null);
        }}
        onConfirm={handleConfirmMarkComplete}
        message="Are you sure you want to mark this project as complete? The client will be asked to confirm completion."
      />
    </div>
  );
};

export default ActiveGoProjects;