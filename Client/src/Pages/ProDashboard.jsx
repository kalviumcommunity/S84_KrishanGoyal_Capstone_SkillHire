import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import NavbarDashboards from "../Components/NavbarDashboards";
import "../Styles/ProDashboard.css";

const ConfirmModal = ({ open, onClose, onConfirm, message }) => {
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="confirm-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>×</button>
        <div className="confirm-modal-message">{message}</div>
        <div className="confirm-modal-actions">
          <button className="btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
};

export default function ProDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("projects");
  const [projects, setProjects] = useState([]);
  const [earnings, setEarnings] = useState({
    total: 0,
    pending: 0,
    completed: 0,
  });
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [projectToMark, setProjectToMark] = useState(null);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    const onPopState = () => {
      window.history.pushState(null, "", window.location.href);
    };
    window.addEventListener("popstate", onPopState);

    return () => {
      window.removeEventListener("popstate", onPopState);
    };
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const projectsRes = await axios.get(
        `${baseUrl}/api/pro-projects/assigned`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          withCredentials: true,
        }
      );
      setProjects(projectsRes.data.projects || []);

      const earningsRes = await axios.get(
        `${baseUrl}/api/pro-projects/earnings`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          withCredentials: true,
        }
      );
      setEarnings(
        earningsRes.data.earnings || { total: 0, pending: 0, completed: 0 }
      );
      setTransactions(earningsRes.data.transactions || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle mark complete functionality
  const handleMarkCompleteClick = (projectId) => {
    setProjectToMark(projectId);
    setShowConfirmModal(true);
  };

  const handleConfirmMarkComplete = async () => {
    if (!projectToMark) return;
    try {
      await axios.put(
        `${baseUrl}/api/pro-projects/${projectToMark}/mark-complete`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          withCredentials: true,
        }
      );
      
      // Update UI
      setProjects(
        projects.map((project) =>
          project._id === projectToMark ? { ...project, status: "pending confirmation" } : project
        )
      );
      setShowConfirmModal(false);
      setProjectToMark(null);
      alert("Project marked as completed! Waiting for client confirmation.");
    } catch (error) {
      console.error("Error marking as complete:", error);
      alert("Failed to mark as complete. Please try again.");
      setShowConfirmModal(false);
      setProjectToMark(null);
    }
  };

  const handleViewDetails = (projectId) => {
    window.location.href = `/pro-projects/${projectId}`;
  };

  return (
    <div className="pro-dashboard">
      <NavbarDashboards />

      <div className="dashboard-container">
        <header className="dashboard-header">
          <div className="welcome-message">
            <h1>Welcome back, {user?.fullName || user?.email || "Pro"}!</h1>
            <p>Here's what's happening with your projects today</p>
          </div>
        </header>

        <div className="stats-container">
          <div className="stat-card">
            <h3>Total Earnings</h3>
            <p className="stat-value">₹{earnings.total?.toLocaleString() || 0}</p>
            <span className="stat-label">All Projects</span>
          </div>
          <div className="stat-card">
            <h3>Active Projects</h3>
            <p className="stat-value">
              {projects.filter((p) => 
                p.status === "in-progress" || 
                p.status === "assigned but not completed"
              ).length}
            </p>
            <span className="stat-label">In Progress</span>
          </div>
          <div className="stat-card">
            <h3>Pending Payments</h3>
            <p className="stat-value">₹{earnings.pending?.toLocaleString() || 0}</p>
            <span className="stat-label">To be received</span>
          </div>
          <div className="stat-card">
            <h3>Completed</h3>
            <p className="stat-value">
              {projects.filter((p) => p.status === "completed").length}
            </p>
            <span className="stat-label">Projects</span>
          </div>
        </div>

        <div className="dashboard-tabs">
          <button
            className={`tab-btn ${activeTab === "projects" ? "active" : ""}`}
            onClick={() => setActiveTab("projects")}
          >
            My Projects
          </button>
          <button
            className={`tab-btn ${activeTab === "earnings" ? "active" : ""}`}
            onClick={() => setActiveTab("earnings")}
          >
            Earnings
          </button>
        </div>

        <div className="tab-content">
          {loading ? (
            <div className="loading-spinner">Loading...</div>
          ) : (
            <>
              {activeTab === "projects" && (
                <div className="projects-grid">
                  {projects.length === 0 ? (
                    <div className="no-projects-message">
                      <p>You don't have any active projects.</p>
                      <button 
                        className="find-projects-btn"
                        onClick={() => window.location.href = "/pro-projects"}
                      >
                        Find Projects
                      </button>
                    </div>
                  ) : (
                    projects.map((project) => (
                      <div key={project._id} className="project-card">
                        <div className="project-header">
                          <h3>{project.title}</h3>
                          <span className={`status-badge ${project.status.replace(/\s+/g, "-")}`}>
                            {project.status}
                          </span>
                        </div>
                        <div className="project-details">
                          <p>
                            <strong>Client:</strong> {project.postedBy?.fullName || "Client"}
                          </p>
                          <p>
                            <strong>Budget:</strong> ₹
                            {project.budget?.toLocaleString() || 0}
                          </p>
                          <p>
                            <strong>Due Date:</strong>{" "}
                            {project.dueDate ? new Date(project.dueDate).toLocaleDateString() : "Not specified"}
                          </p>
                        </div>
                        <div className="project-actions">
                          <button 
                            className="btn-primary"
                            onClick={() => handleViewDetails(project._id)}
                          >
                            View Details
                          </button>
                          
                          {/* Mark Complete Button - Only show if project is in progress */}
                          {(project.status === "in-progress" || 
                            project.status === "assigned but not completed") && (
                            <button
                              className="btn-outline"
                              onClick={() => handleMarkCompleteClick(project._id)}
                            >
                              Mark Complete
                            </button>
                          )}
                          
                          {/* Pending confirmation message */}
                          {project.status === "pending confirmation" && (
                            <span className="pending-confirmation-msg">
                              Waiting for client confirmation...
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === "earnings" && (
                <div className="earnings-container">
                  <div className="earnings-chart">
                    <div className="chart-placeholder"></div>
                  </div>
                  <div className="transactions-list">
                    <h3>Recent Transactions</h3>
                    {transactions.length === 0 ? (
                      <p className="no-transactions">No transactions yet.</p>
                    ) : (
                      transactions.map((tx, idx) => (
                        <div className="transaction-item" key={idx}>
                          <div className="transaction-info">
                            <p className="transaction-title">{tx.title}</p>
                            <p className="transaction-date">
                              {new Date(tx.date).toLocaleDateString()}
                            </p>
                          </div>
                          <p className="transaction-amount">
                            +₹{tx.amount?.toLocaleString() || 0}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Confirm Modal for Mark Complete */}
      <ConfirmModal
        open={showConfirmModal}
        onClose={() => {
          setShowConfirmModal(false);
          setProjectToMark(null);
        }}
        onConfirm={handleConfirmMarkComplete}
        message="Are you sure you want to mark this project as completed? The client will be asked to confirm."
      />
    </div>
  );
}