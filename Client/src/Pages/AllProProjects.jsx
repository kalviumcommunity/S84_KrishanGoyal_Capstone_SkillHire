import React, { useEffect, useState } from "react";
import axios from "axios";
import NavbarDashboards from "../Components/NavbarDashboards";
import { useNavigate } from "react-router-dom";
import "../Styles/AllProProjects.css";

const AllProProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPitchModal, setShowPitchModal] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [pitch, setPitch] = useState("");
  const [submittingPitch, setSubmittingPitch] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/pro-projects/all`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
            withCredentials: true,
          }
        );
        setProjects(res.data.projects || []);
      } catch (err) {
        console.error(err)
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
    setSubmittingPitch(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/pro-projects/${selectedProjectId}/apply`,
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
      console.error('Error submitting pitch:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        headers: err.response?.headers
      });
      alert(
        err.response?.data?.error ||
        err.response?.data?.details ||
        "Failed to submit application. Please try again."
      );
    } finally {
      setSubmittingPitch(false);
    }
  };

  const handleViewDetails = (projectId) => {
    navigate(`/pro-projects/${projectId}`);
  };

  // Only show projects that are not yet assigned
  const availableProjects = projects.filter(
    (project) => project.status === "yet to be assigned"
  );

  return (
    <div>
      <NavbarDashboards />
      {/* Success Alert */}
      {successMessage && (
        <div className="custom-success-alert">{successMessage}</div>
      )}
      <div className="dashboard-container">
        <h2>All PRO Projects</h2>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="projects-grid">
            {availableProjects.length === 0 ? (
              <div
                style={{
                  gridColumn: "1/-1",
                  textAlign: "center",
                  color: "#888",
                  fontSize: "1.2rem",
                  marginTop: "2rem",
                }}
              >
                No projects available right now. Please check back later!
              </div>
            ) : (
              availableProjects.map((project) => (
                <div key={project._id} className="project-card">
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <p>
                    <strong>Budget:</strong> ₹{project.budget}
                  </p>
                  <button
                    onClick={() => handleShowInterestClick(project._id)}
                  >
                    Show Interest
                  </button>
                  <button
                    style={{ marginLeft: "10px" }}
                    onClick={() => handleViewDetails(project._id)}
                  >
                    View Details
                  </button>
                </div>
              ))
            )}
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
                  disabled={submittingPitch}
                />
                <div style={{ marginTop: "10px" }}>
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={submittingPitch}
                  >
                    {submittingPitch ? "Submitting..." : "Submit Pitch"}
                  </button>
                  <button
                    type="button"
                    className="btn-outline"
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
    </div>
  );
};

export default AllProProjects;