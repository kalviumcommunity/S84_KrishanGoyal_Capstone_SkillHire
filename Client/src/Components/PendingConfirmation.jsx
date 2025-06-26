import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import NavbarDashboards from "../Components/NavbarDashboards";
import "../Styles/PendingConfirmation.css";
import ConfirmModal from "../Components/ConfirmModal";
import PaymentProcessor from "../Components/PaymentProcessor";

const PendingConfirmation = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [projectToConfirm, setProjectToConfirm] = useState(null);
  const [projectType, setProjectType] = useState(null);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    if (user?._id) {
      fetchPendingProjects();
    }
  }, [user]);

  const fetchPendingProjects = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        `${baseUrl}/api/projects/pending-confirmation/${user._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          withCredentials: true,
        }
      );

      setProjects(response.data.projects || []);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load pending projects. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmClick = (projectId, type) => {
    setProjectToConfirm(projectId);
    setProjectType(type);
    setShowConfirmModal(true);
  };

  const handleConfirmCompletion = async () => {
    if (!projectToConfirm || !projectType) return;

    try {
      // Instead of directly confirming, start the payment process
      setShowConfirmModal(false);
      setShowPaymentModal(true);
    } catch {
      alert("Failed to process payment. Please try again.");
      setShowConfirmModal(false);
      setProjectToConfirm(null);
      setProjectType(null);
    }
  };

  const viewProjectDetails = (projectId, type) => {
    window.location.href = `/${type}-projects/${projectId}`;
  };

  return (
    <div className="pending-confirmation-page">
      <NavbarDashboards />

      <div className="page-container">
        <header className="page-header">
          <h1>Pending Confirmation</h1>
          <p>Projects waiting for your confirmation of completion</p>
        </header>

        {successMessage && (
          <div className="custom-success-alert">{successMessage}</div>
        )}

        {error && (
          <div className="error-message">
            {error}
            <button onClick={fetchPendingProjects}>Retry</button>
          </div>
        )}

        {loading ? (
          <div className="loading-spinner">Loading pending projects...</div>
        ) : projects.length > 0 ? (
          <div className="projects-grid">
            {projects.map((project) => (
              <div key={project._id} className="project-card">
                <div className="project-header">
                  <h3>{project.title}</h3>
                  <span className="project-type-badge">
                    {project.type.toUpperCase()}
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
                      <div className="detail-item">
                        <span className="detail-label">Payment:</span>
                        <span>
                          ₹{project.payment?.toLocaleString() || "TBD"}
                        </span>
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
                </div>

                <div className="project-actions">
                  <button
                    className="action-button view-details"
                    onClick={() =>
                      viewProjectDetails(project._id, project.type)
                    }
                  >
                    View Details
                  </button>
                  <button
                    className="action-button confirm-button"
                    onClick={() =>
                      handleConfirmClick(project._id, project.type)
                    }
                  >
                    Confirm & Pay
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-projects">
            <p>You don't have any projects pending confirmation.</p>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        open={showConfirmModal}
        onClose={() => {
          setShowConfirmModal(false);
          setProjectToConfirm(null);
          setProjectType(null);
        }}
        onConfirm={handleConfirmCompletion}
        message="Are you sure you want to confirm this project completion? You will proceed to payment after confirmation."
      />

      {/* Payment Modal */}
      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentProcessor
          projectId={projectToConfirm}
          projectType={projectType}
          onClose={() => {
            setShowPaymentModal(false);
            setProjectToConfirm(null);
            setProjectType(null);
          }}
          onSuccess={() => {
            // console.log("Payment successful:", paymentData);
            setSuccessMessage('Payment successful')

            setProjects(
              projects.filter((project) => project._id !== projectToConfirm)
            );

            setSuccessMessage(
              "Project marked as completed and payment processed successfully!"
            );
            setTimeout(() => setSuccessMessage(""), 5000);

            setShowPaymentModal(false);
            setProjectToConfirm(null);
            setProjectType(null);

            // Force refresh data from server to ensure latest status
            setTimeout(() => {
              fetchPendingProjects();
            }, 2000);
          }}
        />
      )}
    </div>
  );
};

export default PendingConfirmation;
