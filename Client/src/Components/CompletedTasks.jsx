import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import NavbarDashboards from "../Components/NavbarDashboards";
import "../Styles/CompletedTasks.css";

const CompletedTasks = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    if (user?._id) {
      fetchCompletedProjects();
    }
  }, [user]);

  const fetchCompletedProjects = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        `${baseUrl}/api/go-projects/completed/${user._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          withCredentials: true,
        }
      );

      setProjects(response.data.projects || []);
    } catch (error) {
      console.error("Error fetching completed projects:", error);
      setError(
        error.response?.data?.message ||
          "Failed to load completed projects. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Function to navigate to project details
  const viewProjectDetails = (projectId) => {
    window.location.href = `/go-projects/${projectId}`;
  };

  return (
    <div className="completed-tasks-page">
      <NavbarDashboards />

      <div className="page-container">
        <header className="page-header">
          <h1>Completed Tasks</h1>
          <p>Review your completed and pending confirmation tasks</p>
        </header>

        {error && (
          <div className="error-message">
            {error}
            <button onClick={fetchCompletedProjects}>Retry</button>
          </div>
        )}

        {loading ? (
          <div className="loading-spinner">Loading completed tasks...</div>
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

                  {project.status === "pending confirmation" && (
                    <div className="pending-message">
                      Waiting for client confirmation...
                    </div>
                  )}
                </div>

                <div className="project-actions">
                  <button
                    className="action-button view-details"
                    onClick={() => viewProjectDetails(project._id)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-projects">
            <p>You don't have any completed tasks yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompletedTasks;