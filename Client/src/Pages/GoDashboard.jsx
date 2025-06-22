import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import NavbarDashboards from "../Components/NavbarDashboards";
import "../Styles/GoDashboard.css";
import { useNavigate } from "react-router-dom";

const ConfirmModal = ({ open, onClose, onConfirm, message }) => {
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          ×
        </button>
        <div className="confirm-modal-message">{message}</div>
        <div className="confirm-modal-actions">
          <button className="btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-primary" onClick={onConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default function GoDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("jobs");
  const [jobs, setJobs] = useState([]);
  const [availableJobs, setAvailableJobs] = useState([]);
  const [earnings, setEarnings] = useState({
    total: 0,
    pending: 0,
    completed: 0,
  });
  const [loading, setLoading] = useState(true);
  const [availableLoading, setAvailableLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [filters, setFilters] = useState({
    location: "",
    category: "",
  });
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [jobToMark, setJobToMark] = useState(null);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetchUserData();
  }, [user]);

  useEffect(() => {
    if (activeTab === "available") {
      fetchAvailableJobs();
    }
  }, [activeTab, filters]);

  const fetchUserData = async () => {
    if (!user?._id) return;

    try {
      setLoading(true);
      // Get jobs ASSIGNED to this worker (not jobs they posted)
      const jobsRes = await axios.get(
        `${baseUrl}/api/go-projects/assigned/${user._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          withCredentials: true,
        }
      );
      setJobs(jobsRes.data.projects || []);
      // For earnings, we'll use the available data or create a placeholder
      // Since there's no specific earnings endpoint for go-workers in the routes
      const completedJobs =
        jobsRes.data.projects?.filter((job) => job.status === "completed") ||
        [];
      const pendingJobs =
        jobsRes.data.projects?.filter(
          (job) =>
            job.status === "in-progress" ||
            job.status === "assigned but not completed"
        ) || [];

      const earnings = {
        total: completedJobs.reduce((sum, job) => sum + (job.payment || 0), 0),
        pending: pendingJobs.reduce((sum, job) => sum + (job.payment || 0), 0),
        completed: completedJobs.length,
      };

      setEarnings(earnings);

      // Create recent transactions from completed jobs
      const recentTransactions = completedJobs
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        .slice(0, 5)
        .map((job) => ({
          title: job.title,
          amount: job.payment || 0,
          date: job.updatedAt || job.completedAt || job.createdAt,
        }));

      setTransactions(recentTransactions);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableJobs = async () => {
    try {
      setAvailableLoading(true);

      // Fetch all available go-projects (those not assigned)
      const response = await axios.get(`${baseUrl}/api/go-projects/available`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        withCredentials: true,
        params: filters,
      });

      setAvailableJobs(response.data.projects || []);
    } catch (error) {
      console.error("Error fetching available jobs:", error);
    } finally {
      setAvailableLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleApplyFilters = () => {
    fetchAvailableJobs();
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

      if (response.data.project) {
        // Refresh available jobs and user's jobs
        fetchAvailableJobs();
        fetchUserData();
        alert("Project accepted successfully!");
      }
    } catch (error) {
      console.error("Error accepting job:", error);
      alert(
        error.response?.data?.error || "Failed to accept job. Please try again."
      );
    }
  };

  // Modal-based mark complete
  const handleMarkCompleteClick = (jobId) => {
    setJobToMark(jobId);
    setShowConfirmModal(true);
  };

const handleConfirmMarkComplete = async () => {
    if (!jobToMark) return;
    try {
      // Update: Fix incorrect endpoint - change to /mark-complete
      await axios.put(
        `${baseUrl}/api/go-projects/${jobToMark}/mark-complete`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          withCredentials: true,
        }
      );

      // Update UI instantly
      setJobs(
        jobs.map((job) =>
          job._id === jobToMark ? { ...job, status: "pending confirmation" } : job
        )
      );
      setShowConfirmModal(false);
      setJobToMark(null);
      fetchUserData();
      alert("Marked as completed! Waiting for client confirmation.");
    } catch (error) {
      console.error("Error marking as complete:", error);
      alert("Failed to mark as complete. Please try again.");
      setShowConfirmModal(false);
      setJobToMark(null);
    }
}

  const handleViewDetails = (job) => {
    setSelectedJob(job);
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedJob(null);
  };

  return (
    <div className="go-dashboard">
      <NavbarDashboards />

      <div className="dashboard-container">
        <header className="dashboard-header">
          <div className="welcome-message">
            <h1>
              Welcome back, {user?.fullName || user?.email || "Go Worker"}!
            </h1>
            <p>Check your instant jobs and daily earnings</p>
          </div>
        </header>

        <div className="stats-container">
          <div className="stat-card">
            <h3>Daily Earnings</h3>
            <p className="stat-value">₹{earnings.total.toLocaleString()}</p>
            <span className="stat-label">Last 24 hours</span>
          </div>
          <div className="stat-card">
            <h3>Active Jobs</h3>
            <p className="stat-value">
              {
                jobs.filter(
                  (j) =>
                    j.status === "in-progress" ||
                    j.status === "assigned but not completed"
                ).length
              }
            </p>
            <span className="stat-label">In Progress</span>
          </div>
          <div className="stat-card">
            <h3>Pending Payments</h3>
            <p className="stat-value">₹{earnings.pending.toLocaleString()}</p>
            <span className="stat-label">To be received</span>
          </div>
          <div className="stat-card">
            <h3>Completed</h3>
            <p className="stat-value">
              {jobs.filter((j) => j.status === "completed").length}
            </p>
            <span className="stat-label">Jobs Today</span>
          </div>
        </div>

        <div className="dashboard-tabs">
          <button
            className={`tab-btn ${activeTab === "jobs" ? "active" : ""}`}
            onClick={() => setActiveTab("jobs")}
          >
            My Jobs
          </button>
          <button
            className={`tab-btn ${activeTab === "earnings" ? "active" : ""}`}
            onClick={() => setActiveTab("earnings")}
          >
            Earnings
          </button>
          <button
            className={`tab-btn ${activeTab === "available" ? "active" : ""}`}
            onClick={() => setActiveTab("available")}
          >
            Available Jobs
          </button>
        </div>

        <div className="tab-content">
          {activeTab === "jobs" && loading ? (
            <div className="loading-spinner">Loading...</div>
          ) : (
            <>
              {activeTab === "jobs" && (
                <div className="jobs-grid">
                  {jobs.length === 0 ? (
                    <p className="no-content-message">
                      No active jobs. Check available jobs to find work!
                    </p>
                  ) : (
                    jobs.map((job) => (
                      <div key={job._id} className="job-card">
                        <div className="job-header">
                          <h3>{job.title}</h3>
                          <span
                            className={`status-badge ${job.status.replace(
                              /\s+/g,
                              "-"
                            )}`}
                          >
                            {job.status.replace(/-/g, " ")}
                          </span>
                        </div>
                        <div className="job-details">
                          <p>
                            <strong>Client:</strong>{" "}
                            {job.postedBy?.fullName || "Client"}
                          </p>
                          <p>
                            <strong>Pay Rate:</strong> ₹
                            {(job.payment || 0).toLocaleString()}
                          </p>
                          <p>
                            <strong>Location:</strong> {job.city}
                            {job.subCity ? `, ${job.subCity}` : ""}
                          </p>
                          <p>
                            <strong>Category:</strong>{" "}
                            {job.category || "General"}
                          </p>
                        </div>
                        <div className="job-actions">
                          <button
                            className="btn-primary"
                            onClick={() => handleViewDetails(job)}
                          >
                            View Details
                          </button>
                          {(job.status === "assigned but not completed" ||
                            job.status === "in-progress") && (
                            <button
                              className="btn-outline"
                              onClick={() => handleMarkCompleteClick(job._id)}
                            >
                              Mark Complete
                            </button>
                          )}
                          {job.status === "pending confirmation" && (
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
                    <h3>Weekly Earnings</h3>
                    <div className="chart-placeholder"></div>
                  </div>
                  <div className="transactions-list">
                    <h3>Recent Payments</h3>
                    {transactions.length === 0 ? (
                      <p>No transactions yet.</p>
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
                            +₹{tx.amount.toLocaleString()}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {activeTab === "available" && (
                <div className="available-jobs">
                  <div className="filters-row">
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
                      <label>Job Type:</label>
                      <select
                        name="category"
                        value={filters.category}
                        onChange={handleFilterChange}
                      >
                        <option value="">All Types</option>
                        <option value="Cleaning">Cleaning</option>
                        <option value="Delivery">Delivery</option>
                        <option value="Moving">Moving</option>
                        <option value="Repairs">Repairs</option>
                        <option value="Installation">Installation</option>
                        <option value="Gardening">Gardening</option>
                      </select>
                    </div>
                    <button className="btn-filter" onClick={handleApplyFilters}>
                      Filter
                    </button>
                  </div>

                  {availableLoading ? (
                    <div className="loading-spinner">
                      Loading available jobs...
                    </div>
                  ) : (
                    <div className="jobs-grid">
                      {availableJobs.length === 0 ? (
                        <p className="no-content-message">
                          No available jobs match your criteria.
                        </p>
                      ) : (
                        availableJobs.map((job) => (
                          <div key={job._id} className="job-card available">
                            <div className="job-header">
                              <h3>{job.title}</h3>
                              <span
                                className={`status-badge ${
                                  job.urgent ? "urgent" : "new"
                                }`}
                              >
                                {job.urgent ? "Urgent" : "New"}
                              </span>
                            </div>
                            <div className="job-details">
                              <p>
                                <strong>Client:</strong>{" "}
                                {job.postedBy?.fullName || "Client"}
                              </p>
                              <p>
                                <strong>Pay Rate:</strong> ₹
                                {(job.payment || 0).toLocaleString()}
                              </p>
                              <p>
                                <strong>Location:</strong> {job.city}
                                {job.subCity ? `, ${job.subCity}` : ""}
                              </p>
                              <p>
                                <strong>Category:</strong>{" "}
                                {job.category || "General"}
                              </p>
                            </div>
                            <div className="job-actions">
                              <button
                                className="btn-primary"
                                onClick={() => handleViewDetails(job)}
                              >
                                View Details
                              </button>
                              <button
                                className="btn-accept"
                                onClick={() => handleAcceptJob(job._id)}
                              >
                                Accept Job
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Job Details Modal */}
      {showDetailsModal && selectedJob && (
        <div className="modal-overlay" onClick={closeDetailsModal}>
          <div
            className="job-details-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close-btn" onClick={closeDetailsModal}>
              ×
            </button>
            <h2>{selectedJob.title}</h2>

            <div className="modal-status">
              <span
                className={`status-badge ${selectedJob.status.replace(
                  /\s+/g,
                  "-"
                )}`}
              >
                {selectedJob.status.replace(/-/g, " ")}
              </span>
            </div>

            <div className="modal-section">
              <h3>Description</h3>
              <p>{selectedJob.description}</p>
            </div>

            <div className="modal-section">
              <h3>Details</h3>
              <div className="modal-details-grid">
                <div className="modal-detail-item">
                  <span className="modal-detail-label">Client:</span>
                  <span>{selectedJob.postedBy?.fullName || "Client"}</span>
                </div>
                <div className="modal-detail-item">
                  <span className="modal-detail-label">Payment:</span>
                  <span>₹{(selectedJob.payment || 0).toLocaleString()}</span>
                </div>
                <div className="modal-detail-item">
                  <span className="modal-detail-label">Location:</span>
                  <span>
                    {selectedJob.city}
                    {selectedJob.subCity ? `, ${selectedJob.subCity}` : ""}
                  </span>
                </div>
                <div className="modal-detail-item">
                  <span className="modal-detail-label">Category:</span>
                  <span>{selectedJob.category || "General"}</span>
                </div>
                <div className="modal-detail-item">
                  <span className="modal-detail-label">Posted on:</span>
                  <span>
                    {new Date(selectedJob.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="modal-actions">
              {(selectedJob.status === "in-progress" ||
                selectedJob.status === "assigned but not completed") && (
                <button
                  className="btn-outline"
                  onClick={() => {
                    handleMarkCompleteClick(selectedJob._id);
                    closeDetailsModal();
                  }}
                >
                  Mark Complete
                </button>
              )}
              {!selectedJob.assignedTo && (
                <button
                  className="btn-accept"
                  onClick={() => {
                    handleAcceptJob(selectedJob._id);
                    closeDetailsModal();
                  }}
                >
                  Accept Job
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Confirm Mark Complete Modal */}
      <ConfirmModal
        open={showConfirmModal}
        onClose={() => {
          setShowConfirmModal(false);
          setJobToMark(null);
        }}
        onConfirm={handleConfirmMarkComplete}
        message="Are you sure you want to mark this task as completed? The client will be asked to confirm."
      />
    </div>
  );
}
