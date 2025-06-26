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
  const [selectedProject, setSelectedProject] = useState(null);
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
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

      // Fetch payment details for each project
      const projectsWithPayments = await Promise.all(
        (response.data.projects || []).map(async (project) => {
          try {
            const paymentResponse = await axios.get(
              `${baseUrl}/api/payments/project/${project.type}/${project._id}`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
                withCredentials: true,
              }
            );
            
            return {
              ...project,
              paymentDetails: paymentResponse.data.payment || null
            };
          } catch (err) {
            console.error(`Error fetching payment for project ${project._id}:`, err);
            return project;
          }
        })
      );

      setProjects(projectsWithPayments);
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

  const openPaymentDetails = (project) => {
    setSelectedProject(project);
    setShowPaymentDetails(true);
  };

  const closePaymentDetails = () => {
    setSelectedProject(null);
    setShowPaymentDetails(false);
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
                    <span className="project-type-badge">
                      {project.type.toUpperCase()}
                    </span>
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
                      <div className="detail-item">
                        <span className="detail-label">Payment:</span>
                        <span>₹{project.payment?.toLocaleString() || "N/A"}</span>
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

                  {project.paidAt && (
                    <div className="detail-item payment-info">
                      <span className="detail-label">Paid on:</span>
                      <span>
                        {new Date(project.paidAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}

                  {project.paymentDetails && (
                    <div className="detail-item payment-info">
                      <span className="detail-label">Payment ID:</span>
                      <span>{project.paymentDetails.razorpayPaymentId?.substring(0, 10)}...</span>
                    </div>
                  )}
                </div>

                <div className="project-actions">
                  <button
                    className="action-button view-details"
                    onClick={() => viewProjectDetails(project._id, project.type)}
                  >
                    View Details
                  </button>
                  
                  {project.paymentDetails && (
                    <button
                      className="action-button payment-details"
                      onClick={() => openPaymentDetails(project)}
                    >
                      Payment Details
                    </button>
                  )}
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

      {/* Payment Details Modal */}
      {showPaymentDetails && selectedProject && (
        <div className="modal-overlay" onClick={closePaymentDetails}>
          <div className="payment-details-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closePaymentDetails}>×</button>
            <h2>Payment Details</h2>
            
            <div className="payment-record">
              <div className="payment-record-header">
                <div className="payment-amount">₹{selectedProject.paymentDetails?.amount.toLocaleString()}</div>
                <div className="payment-status">
                  <span className="status-badge success">Completed</span>
                </div>
              </div>
              
              <div className="payment-record-details">
                <div className="record-detail">
                  <span className="detail-label">Project:</span>
                  <span className="detail-value">{selectedProject.title}</span>
                </div>
                
                <div className="record-detail">
                  <span className="detail-label">Transaction ID:</span>
                  <span className="detail-value">{selectedProject.paymentDetails?.razorpayPaymentId}</span>
                </div>
                
                <div className="record-detail">
                  <span className="detail-label">Payment Date:</span>
                  <span className="detail-value">
                    {selectedProject.paidAt ? new Date(selectedProject.paidAt).toLocaleString() : 
                     selectedProject.paymentDetails?.updatedAt ? new Date(selectedProject.paymentDetails.updatedAt).toLocaleString() : "N/A"}
                  </span>
                </div>
                
                <div className="record-detail">
                  <span className="detail-label">Paid By:</span>
                  <span className="detail-value">{selectedProject.postedBy?.fullName || "Client"}</span>
                </div>
                
                <div className="record-detail">
                  <span className="detail-label">Paid To:</span>
                  <span className="detail-value">{selectedProject.assignedTo?.fullName || "Worker"}</span>
                </div>
                
                <div className="record-detail">
                  <span className="detail-label">Payment Method:</span>
                  <span className="detail-value">Razorpay</span>
                </div>
              </div>
            </div>
            
            <div className="payment-actions">
              <button 
                className="download-invoice-btn"
                onClick={() => window.open(`${baseUrl}/api/payments/${selectedProject.paymentDetails?._id}/invoice`, '_blank')}
              >
                Download Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClosedProjects;