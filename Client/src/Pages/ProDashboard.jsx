import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import NavbarDashboards from "../Components/NavbarDashboards";
import "../Styles/ProDashboard.css";

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch projects
        const projectsRes = await axios.get(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/api/pro-projects/assigned`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
            withCredentials: true,
          }
        );
        setProjects(projectsRes.data.projects || []);

        // Fetch earnings & transactions
        const earningsRes = await axios.get(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/api/pro-projects/earnings`,
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

    fetchData();
  }, []);

  // Prevent back button
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

  return (
    <div className="pro-dashboard">
      <NavbarDashboards />

      <div className="dashboard-container">
        {/* Welcome Section */}
        <header className="dashboard-header">
          <div className="welcome-message">
            <h1>Welcome back, {user?.fullName || user?.email || "Pro"}!</h1>
            <p>Here's what's happening with your projects today</p>
          </div>
          {/* <div className="profile-badge">
            <img
              src={user?.avatar || "/default-avatar.png"}
              alt="Profile"
              className="profile-image"
            />
            <span className="pro-badge">PRO</span>
          </div> */}
        </header>

        {/* Stats Cards */}
        <div className="stats-container">
          <div className="stat-card">
            <h3>Total Earnings</h3>
            <p className="stat-value">₹{earnings.total.toLocaleString()}</p>
            <span className="stat-label">All Projects</span>
          </div>
          <div className="stat-card">
            <h3>Active Projects</h3>
            <p className="stat-value">
              {projects.filter((p) => p.status === "in-progress").length}
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
              {projects.filter((p) => p.status === "completed").length}
            </p>
            <span className="stat-label">Projects</span>
          </div>
        </div>

        {/* Dashboard Tabs */}
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

        {/* Tab Content */}
        <div className="tab-content">
          {loading ? (
            <div className="loading-spinner">Loading...</div>
          ) : (
            <>
              {activeTab === "projects" && (
                <div className="projects-grid">
                  {projects.map((project) => (
                    <div key={project._id} className="project-card">
                      <div className="project-header">
                        <h3>{project.title}</h3>
                        <span className={`status-badge ${project.status}`}>
                          {project.status.replace("-", " ")}
                        </span>
                      </div>
                      <div className="project-details">
                        <p>
                          <strong>Client:</strong> {project.client}
                        </p>
                        <p>
                          <strong>Budget:</strong> ₹
                          {project.budget.toLocaleString()}
                        </p>
                        <p>
                          <strong>Deadline:</strong>{" "}
                          {new Date(project.deadline).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="project-actions">
                        <button className="btn-primary">View Details</button>
                        {project.status === "pending" && (
                          <button className="btn-outline">
                            Accept Project
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "earnings" && (
                <div className="earnings-container">
                  <div className="earnings-chart">
                    {/* Placeholder for chart */}
                    <div className="chart-placeholder"></div>
                  </div>
                  <div className="transactions-list">
                    <h3>Recent Transactions</h3>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
