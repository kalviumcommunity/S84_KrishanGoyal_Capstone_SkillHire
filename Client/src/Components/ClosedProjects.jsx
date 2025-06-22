import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import NavbarDashboards from "../Components/NavbarDashboards";
import "../Styles/ClosedProjects.css";

const ClosedProjects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    if (user?._id) {
      fetchClosedProjects();
    }
  }, [user]);

  const fetchClosedProjects = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all completed projects
      const response = await axios.get(
        `${baseUrl}/api/projects/completed/${user._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          withCredentials: true,
        }
      );

      setProjects(response.data.projects || []);
    } catch (error) {
      console.error("Error fetching closed projects:", error);
      setError(
        error.response?.data?.message ||
          "Failed to load closed projects. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const viewProjectDetails = (projectId, type) => {
    window.location.href = `/${type}-projects/${projectId}`;
  };

  return (
    <div className="closed-projects-page">
      <NavbarDashboards />

      <div className="page-container">
        <header className="page-header">
          <h1>Closed Projects</h1>
          <p>Your completed project history</p>
        </header>

        {error && (
          <div className="error-message">
            {error}
            <button onClick={fetchClosedProjects}>Retry</button>
          </div>
        )}

        {loading ? (
          <div className="loading-spinner">Loading closed projects...</div>
        ) : projects.length > 0 ? (
          <div className="projects-grid">
            {projects.map((project) => (
              <div key={project._id} className="project-card">
                <div className="project-header">
                  <h3>{project.title}</h3>
                  <div className="project-badges">
                    <span className="project-type-badge">{project.type.toUpperCase()}</span>
                    <span className="status-badge completed">Completed</span>
                  </div>
                </div>

                <p className="project-description">{project.description}</p>

                <div className="project-details">
                  {project.type === "go" ? (
                    <>
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
                    </>
                  ) : (
                    <>
                      <div className="detail-item">
                        <span className="detail-label">Budget:</span>
                        <span>₹{project.budget?.toLocaleString()}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Due Date:</span>
                        <span>
                          {project.dueDate
                            ? new Date(project.dueDate).toLocaleDateString()
                            : "N/A"}
                        </span>
                      </div>
                    </>
                  )}

                  <div className="detail-item">
                    <span className="detail-label">Completed by:</span>
                    <span>{project.assignedTo?.fullName || "Worker"}</span>
                  </div>

                  <div className="detail-item">
                    <span className="detail-label">Completed on:</span>
                    <span>
                      {project.completedAt
                        ? new Date(project.completedAt).toLocaleDateString()
                        : new Date(project.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="project-actions">
                  <button
                    className="action-button view-details"
                    onClick={() => viewProjectDetails(project._id, project.type)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-projects">
            <p>You don't have any closed projects yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClosedProjects;