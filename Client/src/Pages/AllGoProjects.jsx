import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavbarDashboards from "../Components/NavbarDashboards";
import "../Styles/AllGoProjects.css";

const AllGoProjects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    location: "",
    category: "",
  });
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (filters.location) params.append("location", filters.location);
      if (filters.category) params.append("category", filters.category);

      const response = await axios.get(
        `${baseUrl}/api/go-projects/available?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          withCredentials: true,
        }
      );

      setProjects(response.data.projects || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setError(
        error.response?.data?.message ||
          "Failed to load projects. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [baseUrl, filters]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const applyFilters = () => {
    fetchProjects();
  };

  const handleAcceptJob = async (jobId) => {
    try {
      const response = await axios.post(
        `${baseUrl}/api/go-projects/${jobId}/accept`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          withCredentials: true,
        }
      );

      if (response.data.chatId) {
        navigate(`/chats/${response.data.chatId}`);
      } else {
        alert("Project accepted successfully!");
        fetchProjects();
      }
    } catch (error) {
      alert(
        error.response?.data?.error ||
          "Failed to accept project. Please try again."
      );
    }
  };

  const handleViewDetails = (project) => {
    setSelectedProject(project);
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedProject(null);
  };

  return (
    <div className="all-go-projects-page">
      <NavbarDashboards />

      <div className="page-container">
        <header className="page-header">
          <h1>Available GO Projects</h1>
          <p>Browse and accept instant jobs that match your skills</p>
        </header>

        <div className="filters-section">
          <div className="filter-group">
            <label>Location:</label>
            <select
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
            >
              <option value="">All Locations</option>
              <option value="north">North</option>
              <option value="south">South</option>
              <option value="east">East</option>
              <option value="west">West</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Category:</label>
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
            >
              <option value="">All Categories</option>
              <option value="Cleaning">Cleaning</option>
              <option value="Delivery">Delivery</option>
              <option value="Moving">Moving</option>
              <option value="Repairs">Repairs</option>
              <option value="Installation">Installation</option>
              <option value="Gardening">Gardening</option>
            </select>
          </div>

          <button className="filter-button" onClick={applyFilters}>
            Apply Filters
          </button>
        </div>

        {error && (
          <div className="error-message">
            {error}
            <button onClick={fetchProjects}>Retry</button>
          </div>
        )}

        {loading ? (
          <div className="loading-spinner">Loading projects...</div>
        ) : projects.length > 0 ? (
          <div className="projects-grid">
            {projects.map((project) => (
              <div key={project._id} className="project-card">
                <div className="project-header">
                  <h3>{project.title}</h3>
                  {project.urgent && (
                    <span className="urgent-badge">Urgent</span>
                  )}
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
                    <span className="detail-label">Posted by:</span>
                    <span>{project.postedBy?.fullName || "Client"}</span>
                  </div>
                </div>

                <div className="project-actions">
                  <button
                    className="action-button view-details"
                    onClick={() => handleViewDetails(project)}
                  >
                    View Details
                  </button>
                  <button
                    className="action-button accept-job"
                    onClick={() => handleAcceptJob(project._id)}
                  >
                    Accept Project
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-projects">
            <p>No available projects match your criteria.</p>
            <button className="refresh-button" onClick={fetchProjects}>
              Refresh
            </button>
          </div>
        )}
      </div>

      {showDetailsModal && selectedProject && (
        <div className="modal-overlay" onClick={closeDetailsModal}>
          <div className="job-details-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeDetailsModal}>×</button>
            <h2>{selectedProject.title}</h2>
            <div className="modal-status">
              <span className="status-badge available">
                Available
              </span>
            </div>
            <div className="modal-section">
              <h3>Description</h3>
              <p>{selectedProject.description}</p>
            </div>
            <div className="modal-section">
              <h3>Details</h3>
              <div className="modal-details-grid">
                <div className="modal-detail-item">
                  <span className="modal-detail-label">Client:</span>
                  <span>{selectedProject.postedBy?.fullName || "Client"}</span>
                </div>
                <div className="modal-detail-item">
                  <span className="modal-detail-label">Payment:</span>
                  <span>₹{selectedProject.payment?.toLocaleString() || "TBD"}</span>
                </div>
                <div className="modal-detail-item">
                  <span className="modal-detail-label">Location:</span>
                  <span>
                    {selectedProject.city}
                    {selectedProject.subCity ? `, ${selectedProject.subCity}` : ""}
                  </span>
                </div>
                <div className="modal-detail-item">
                  <span className="modal-detail-label">Category:</span>
                  <span>{selectedProject.category}</span>
                </div>
                <div className="modal-detail-item">
                  <span className="modal-detail-label">Posted on:</span>
                  <span>{new Date(selectedProject.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <div className="modal-actions">
              <button
                className="action-button accept-job"
                onClick={() => {
                  handleAcceptJob(selectedProject._id);
                  closeDetailsModal();
                }}
              >
                Accept Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllGoProjects;