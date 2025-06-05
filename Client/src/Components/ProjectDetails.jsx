import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../Styles/ProjectDetails.css";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const ProjectDetails = ({ type }) => {
  const { user } = useAuth();
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showApplicantsModal, setShowApplicantsModal] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState("");
  const [showPitchModal, setShowPitchModal] = useState(false);
  const [pitch, setPitch] = useState("");
  const [submittingPitch, setSubmittingPitch] = useState(false);
  const [successMessage, setSuccessMessage] = useState(""); // For all actions
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        setError(null);

        const endpoint = `${baseUrl}/api/${type}-projects/${projectId}`;
        const response = await axios.get(endpoint, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          withCredentials: true,
        });

        const projectData =
          response.data.project ||
          (response.data.projects && response.data.projects[0]);

        if (!projectData) {
          throw new Error("Project data not found in response");
        }

        setProject(projectData);
      } catch (err) {
        setError(
          err.response?.data?.error ||
            err.response?.data?.message ||
            err.message ||
            "Failed to load project"
        );
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchProject();
    }
  }, [type, projectId]);

  const handleBack = () => {
    if (user?.role === "pro-worker") {
      navigate("/pro");
    } else if (user?.role === "go-worker") {
      navigate("/go");
    } else if (user?.role === "client") {
      navigate("/your-projects");
    } else {
      navigate("/");
    }
  };

  // Assign project to applicant
  const handleAssign = async () => {
    if (!selectedApplicant) return;
    setAssigning(true);
    try {
      await axios.post(
        `${baseUrl}/api/pro-projects/${project._id}/assign`,
        { userId: selectedApplicant },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          withCredentials: true,
        }
      );
      setSuccessMessage("Project assigned successfully!");
      setTimeout(() => setSuccessMessage(""), 2000);
      setTimeout(() => window.location.reload(), 2000);
    } catch (err) {
      alert(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to assign project"
      );
    } finally {
      setAssigning(false);
    }
  };

  // Show pitch modal
  const handleShowInterest = () => {
    setPitch("");
    setShowPitchModal(true);
  };

  // Submit pitch
  const handlePitchSubmit = async (e) => {
    e.preventDefault();
    setSubmittingPitch(true);
    try {
      await axios.post(
        `${baseUrl}/api/pro-projects/${project._id}/apply`,
        { pitch },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          withCredentials: true,
        }
      );

      setSuccessMessage("Your pitch has been submitted successfully!");
      setPitch("");
      setTimeout(() => setSuccessMessage(""), 2000);
      setTimeout(() => setShowPitchModal(false), 1500);
    } catch (err) {
      console.error('Error submitting pitch from ProjectDetails:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        headers: err.response?.headers,
        projectId: project._id
      });

      const errorMessage = err.response?.data?.error || 
                          err.response?.data?.details || 
                          err.response?.data?.message || 
                          "Failed to submit pitch";
      
      alert(errorMessage);
    } finally {
      setSubmittingPitch(false);
    }
  };

  const handleDeleteProject = async () => {
    setDeleting(true);
    try {
      await axios.delete(`${baseUrl}/api/pro-projects/${project._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        withCredentials: true,
      });
      setShowDeleteConfirm(false);
      setSuccessMessage("Project deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 2000);
      setTimeout(() => navigate("/your-projects"), 2000);
    } catch (err) {
      alert(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to delete project"
      );
    } finally {
      setDeleting(false);
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

  if (loading) {
    return <div className="loading-spinner">Loading project details...</div>;
  }

  if (error) {
    return (
      <div className="project-details-container">
        <div className="error-message">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={handleBack} className="back-btn">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="project-details-container">
        <div className="error-message">
          <h2>Project Not Found</h2>
          <button onClick={handleBack} className="back-btn">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const myApplication =
    user?.role === "pro-worker"
      ? project.applicants?.find((app) => app.user?._id === user._id)
      : null;

  return (
    <div className="project-details-container">
      {/* Success Alert */}
      {successMessage && (
        <div className="custom-success-alert">{successMessage}</div>
      )}

      <div className="project-details-header">
        <h1>{project.title}</h1>
        <span className={`status-badge ${getStatusBadgeClass(project.status)}`}>
          {project.status}
        </span>
      </div>

      <div className="project-details-content">
        <div className="project-description">
          <h3>Description</h3>
          <p>{project.description}</p>
        </div>

        <div className="pro-project-details">
          <div className="detail-section">
            <h3>Budget</h3>
            <p>₹{project.budget?.toLocaleString()}</p>
          </div>
          <div className="detail-section">
            <h3>Due Date</h3>
            <p>{new Date(project.dueDate).toLocaleDateString()}</p>
          </div>
          <div className="detail-section">
            <h3>Applicants</h3>
            <p>
              {project.applicants?.length || 0}
              {user?.role === "client" &&
                project.applicants &&
                project.applicants.length > 0 && (
                  <button
                    className="view-applicants-btn"
                    style={{ marginLeft: "10px" }}
                    onClick={() => setShowApplicantsModal(true)}
                  >
                    View Applications
                  </button>
                )}
            </p>
          </div>

          {/* Assign To Section (Client only) */}
          {user?.role === "client" &&
            project.status === "yet to be assigned" &&
            project.applicants?.length > 0 && (
              <div className="detail-section assign-section">
                <h3>Assign To</h3>
                <select
                  value={selectedApplicant}
                  onChange={(e) => setSelectedApplicant(e.target.value)}
                  className="assign-dropdown"
                >
                  <option value="">Select applicant</option>
                  {project.applicants.map((app, idx) => (
                    <option key={app.user?._id || idx} value={app.user?._id}>
                      {app.user?.fullName ||
                        app.user?.email ||
                        "Unknown User"}
                    </option>
                  ))}
                </select>
                <button
                  className={`assign-btn${selectedApplicant && !assigning ? " assign-btn-green" : ""}`}
                  disabled={!selectedApplicant || assigning}
                  onClick={handleAssign}
                  style={{ marginLeft: "10px" }}
                >
                  {assigning ? "Assigning..." : "Assign"}
                </button>
              </div>
            )}

          {/* Show Interest or Show Pitch (Pro user only) */}
          {user?.role === "pro-worker" &&
            project.status === "yet to be assigned" &&
            (myApplication ? (
              <div className="detail-section">
                <h3>Your Pitch</h3>
                <blockquote className="your-pitch-blockquote">
                  {myApplication.pitch}
                </blockquote>
              </div>
            ) : (
              <div className="detail-section">
                <button
                  className="show-interest-btn"
                  onClick={handleShowInterest}
                >
                  Show Interest
                </button>
              </div>
            ))}

          <div className="detail-section">
            <h3>Posted By</h3>
            <p>{project.postedBy?.fullName}</p>
          </div>
          <div className="detail-section">
            <h3>Posted On</h3>
            <p>{new Date(project.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="project-actions">
          <button onClick={handleBack} className="back-btn">
            Back to Dashboard
          </button>
        </div>
      </div>

      {/* Floating Delete Button (Client only, not assigned) */}
      {user?.role === "client" && project.status === "yet to be assigned" && (
        <div className="floating-delete-container">
          <button
            className="delete-btn floating-delete-btn"
            onClick={() => setShowDeleteConfirm(true)}
            disabled={deleting}
          >
            {deleting ? "Deleting..." : "Delete Project"}
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-content delete-confirm-modal">
            <h3>Delete Project?</h3>
            <p>
              Are you sure you want to delete this project? <br />
              <span style={{ color: "#e53935" }}>
                This action cannot be undone.
              </span>
            </p>
            <div className="delete-confirm-actions">
              <button
                className="btn-outline"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                className="delete-btn"
                onClick={handleDeleteProject}
                disabled={deleting}
                style={{ marginLeft: "12px" }}
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Applicants Modal */}
      {showApplicantsModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Applicants & Pitches</h3>
            <div className="applicants-list">
              {project.applicants.map((app, idx) => (
                <div className="applicant-card" key={app.user?._id || idx}>
                  <div className="applicant-header">
                    <span className="applicant-name">
                      {app.user?.fullName || app.user?.email || "Unknown User"}
                    </span>
                    <button
                      className="contact-btn"
                      onClick={() => {
                        alert(
                          `Start chat with ${app.user?.fullName || app.user?.email}`
                        );
                      }}
                    >
                      Contact
                    </button>
                  </div>
                  <div className="applicant-pitch">
                    <span>Pitch:</span>
                    <blockquote>{app.pitch}</blockquote>
                  </div>
                </div>
              ))}
            </div>
            <button
              className="close-modal-btn"
              onClick={() => setShowApplicantsModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Show Interest Modal (Pro user only) */}
      {user?.role === "pro-worker" && showPitchModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Submit Your Pitch</h3>
            <form onSubmit={handlePitchSubmit}>
              <textarea
                value={pitch}
                onChange={(e) => setPitch(e.target.value)}
                placeholder="Explain why you are the best fit for this project..."
                required
                rows={5}
                style={{ width: "100%", marginBottom: "1rem" }}
                disabled={submittingPitch}
              />
              <div>
                <button
                  type="submit"
                  className="assign-btn"
                  disabled={submittingPitch}
                >
                  {submittingPitch ? "Submitting..." : "Submit Pitch"}
                </button>
                <button
                  type="button"
                  className="close-modal-btn"
                  style={{ marginLeft: "10px" }}
                  onClick={() => setShowPitchModal(false)}
                  disabled={submittingPitch}
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

export default ProjectDetails;