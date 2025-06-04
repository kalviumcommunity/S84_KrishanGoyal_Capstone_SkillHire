import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import NavbarDashboards from "../Components/NavbarDashboards";
import axios from "axios";
import "../Styles/Client.css";

const Client = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [projectType, setProjectType] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProject, setNewProject] = useState({
    type: "go",
    title: "",
    description: "",
    city: "",
    subCity: "",
    category: "",
    dueDate: "",
    budget: "",
  });
  const [creatingProject, setCreatingProject] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false); // <-- NEW

  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!user?._id) return;

    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);

        let endpoint;
        switch (projectType) {
          case "go":
            endpoint = `${baseUrl}/api/go-projects/${user._id}`;
            break;
          case "pro":
            endpoint = `${baseUrl}/api/pro-projects/my/${user._id}`;
            break;
          default:
            endpoint = `${baseUrl}/api/projects/posted/${user._id}`;
        }

        const response = await axios.get(endpoint, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          withCredentials: true,
        });

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
    };

    fetchProjects();
  }, [projectType, baseUrl, user?._id]);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setCreatingProject(true);
    setError(null);

    try {
      const endpoint =
        newProject.type === "go"
          ? `${baseUrl}/api/go-projects/add`
          : `${baseUrl}/api/pro-projects/add`;

      const payload = {
        title: newProject.title,
        description: newProject.description,
        postedBy: user._id,
      };

      if (newProject.type === "go") {
        payload.city = newProject.city;
        payload.subCity = newProject.subCity || "";
        payload.category = newProject.category;
      } else {
        payload.dueDate = newProject.dueDate;
        payload.budget = Number(newProject.budget);
      }

      const response = await axios.post(endpoint, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      setProjects([response.data.project, ...projects]);
      setShowCreateModal(false);
      setNewProject({
        type: "go",
        title: "",
        description: "",
        city: "",
        subCity: "",
        category: "",
        dueDate: "",
        budget: "",
      });
      setShowSuccessAlert(true); // Show success alert
      setTimeout(() => setShowSuccessAlert(false), 2000); // Hide after 2s
    } catch (error) {
      console.error("Error creating project:", error);
      setError(error.response?.data?.message || "Failed to create project");
    } finally {
      setCreatingProject(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "yet to be assigned":
        return "status-pending";
      case "assigned but not completed":
        return "status-in-progress";
      case "completed":
        return "status-completed";
      default:
        return "";
    }
  };

  const renderProjectTypeFilter = () => (
    <div className="project-filter">
      <button
        className={projectType === "all" ? "active" : ""}
        onClick={() => setProjectType("all")}
      >
        All Projects
      </button>
      <button
        className={projectType === "go" ? "active" : ""}
        onClick={() => setProjectType("go")}
      >
        GO Projects
      </button>
      <button
        className={projectType === "pro" ? "active" : ""}
        onClick={() => setProjectType("pro")}
      >
        PRO Projects
      </button>
    </div>
  );

  const renderProjectCard = (project) => {
    if (!project?._id) return null;

    return (
      <div key={project._id} className="project-card">
        <div className="project-header">
          <h3>{project.title}</h3>
          <span
            className={`status-badge ${getStatusBadgeClass(project.status)}`}
          >
            {project.status}
          </span>
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
                <span>{new Date(project.dueDate).toLocaleDateString()}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Applicants:</span>
                <span>{project.applicants?.length || 0}</span>
              </div>
            </>
          )}
        </div>

        <div className="project-actions">
          <Link
            to={`/${project.type}-projects/${project._id}`}
            className="view-btn"
          >
            View Details
          </Link>
          {project.status === "yet to be assigned" && (
            <button className="edit-btn">Edit</button>
          )}
        </div>
      </div>
    );
  };

  const renderCreateProjectModal = () => (
    <div className="modal-overlay">
      <div className="create-project-modal">
        <h2>Create New {newProject.type.toUpperCase()} Project</h2>
        <button
          className="close-modal"
          onClick={() => setShowCreateModal(false)}
        >
          &times;
        </button>
        <div className="modal-content">
          <form onSubmit={handleCreateProject}>
            <div className="form-group">
              <label>Project Type</label>
              <div className="type-toggle">
                <button
                  type="button"
                  className={newProject.type === "go" ? "active" : ""}
                  onClick={() => setNewProject({ ...newProject, type: "go" })}
                >
                  GO Project
                </button>
                <button
                  type="button"
                  className={newProject.type === "pro" ? "active" : ""}
                  onClick={() => setNewProject({ ...newProject, type: "pro" })}
                >
                  PRO Project
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>Title*</label>
              <input
                type="text"
                value={newProject.title}
                onChange={(e) =>
                  setNewProject({ ...newProject, title: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label>Description*</label>
              <textarea
                value={newProject.description}
                onChange={(e) =>
                  setNewProject({ ...newProject, description: e.target.value })
                }
                required
              />
            </div>

            {newProject.type === "go" ? (
              <>
                <div className="form-group">
                  <label>City*</label>
                  <input
                    type="text"
                    value={newProject.city}
                    onChange={(e) =>
                      setNewProject({ ...newProject, city: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Sub City</label>
                  <input
                    type="text"
                    value={newProject.subCity}
                    onChange={(e) =>
                      setNewProject({ ...newProject, subCity: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Category*</label>
                  <input
                    type="text"
                    value={newProject.category}
                    onChange={(e) =>
                      setNewProject({ ...newProject, category: e.target.value })
                    }
                    required
                  />
                </div>
              </>
            ) : (
              <>
                <div className="form-group">
                  <label>Budget (₹)*</label>
                  <input
                    type="number"
                    value={newProject.budget}
                    onChange={(e) =>
                      setNewProject({ ...newProject, budget: e.target.value })
                    }
                    required
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label>Due Date</label>
                  <input
                    type="date"
                    value={newProject.dueDate}
                    onChange={(e) =>
                      setNewProject({ ...newProject, dueDate: e.target.value })
                    }
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
              </>
            )}

            <div className="form-actions">
              <button
                type="submit"
                className="submit-btn"
                disabled={creatingProject}
              >
                {creatingProject ? (
                  <>
                    <span className="spinner"></span> Creating...
                  </>
                ) : (
                  "Create Project"
                )}
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  if (!user) {
    return <div className="loading-spinner">Redirecting to login...</div>;
  }

  return (
    <>
      <NavbarDashboards />
      {/* Success Alert */}
      {showSuccessAlert && (
        <div className="custom-success-alert">
          Project created successfully!
        </div>
      )}
      <div className="client-dashboard">
        <div className="dashboard-content-wrapper">
          <div className="dashboard-header">
            <h1>Welcome back, {user.fullName || "Client"}!</h1>
            <p>
              Manage your {projectType === "all" ? "" : projectType} projects
            </p>
          </div>

          {error && (
            <div className="error-message">
              {error}
              <button onClick={() => window.location.reload()}>Retry</button>
            </div>
          )}

          {renderProjectTypeFilter()}

          <div className="dashboard-actions">
            <button
              className="new-project-btn"
              onClick={() => setShowCreateModal(true)}
            >
              + New Project
            </button>
          </div>

          {loading ? (
            <div className="loading-spinner">Loading projects...</div>
          ) : projects.length > 0 ? (
            <div className="projects-grid">
              {projects.map(renderProjectCard)}
            </div>
          ) : (
            <div className="no-projects">
              <p>
                No {projectType === "all" ? "" : projectType} projects found
              </p>
              <button
                className="create-first-btn"
                onClick={() => setShowCreateModal(true)}
              >
                Create your first project
              </button>
            </div>
          )}

          {showCreateModal && renderCreateProjectModal()}
        </div>
      </div>
    </>
  );
};

export default Client;