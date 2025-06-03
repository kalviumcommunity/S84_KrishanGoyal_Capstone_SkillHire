import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import NavbarDashboards from "../Components/NavbarDashboards";
import { useNavigate } from "react-router-dom";

export default function AllProProjects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPitchModal, setShowPitchModal] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [pitch, setPitch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"}/api/pro-projects/all`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
            withCredentials: true,
          }
        );
        setProjects(res.data.projects || []);
      } catch (err) {
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const handleShowInterestClick = (projectId) => {
    setSelectedProjectId(projectId);
    setPitch("");
    setShowPitchModal(true);
  };

  const handlePitchSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"}/api/pro-projects/${selectedProjectId}/apply`,
        { pitch },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          withCredentials: true,
        }
      );
      alert("Interest shown successfully!");
      setShowPitchModal(false);
    } catch (err) {
      alert("Failed to show interest.");
    }
  };

  const handleViewDetails = (projectId) => {
    navigate(`/pro-projects/${projectId}`);
  };

  return (
    <div>
      <NavbarDashboards />
      <div className="dashboard-container">
        <h2>All PRO Projects</h2>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="projects-grid">
            {projects.map((project) => (
              <div key={project._id} className="project-card">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <p>
                  <strong>Budget:</strong> ${project.budget}
                </p>
                <button onClick={() => handleShowInterestClick(project._id)}>
                  Show Interest
                </button>
                <button
                  style={{ marginLeft: "10px" }}
                  onClick={() => handleViewDetails(project._id)}
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Pitch Modal */}
        {showPitchModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Write your pitch</h3>
              <form onSubmit={handlePitchSubmit}>
                <textarea
                  value={pitch}
                  onChange={(e) => setPitch(e.target.value)}
                  placeholder="Explain why you are the best fit for this project..."
                  required
                  rows={5}
                  style={{ width: "100%" }}
                />
                <div style={{ marginTop: "10px" }}>
                  <button type="submit" className="btn-primary">
                    Submit Pitch
                  </button>
                  <button
                    type="button"
                    className="btn-outline"
                    style={{ marginLeft: "10px" }}
                    onClick={() => setShowPitchModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}