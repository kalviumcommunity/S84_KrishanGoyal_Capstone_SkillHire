import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import NavbarDashboards from "../Components/NavbarDashboards";
import { useNavigate } from "react-router-dom";

export default function Applied() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplied = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/pro-projects/applied`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
            withCredentials: true,
          }
        );
        setProjects(res.data.projects || []);
      } catch (err) {
        console.error(err);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };
    fetchApplied();
  }, []);

  const visibleProjects = projects.filter(
    (project) => (project.assignedTo?._id || project.assignedTo) !== user._id
  );

  return (
    <div>
      <NavbarDashboards />
      <div className="dashboard-container">
        <h2>Applied Projects</h2>
        {loading ? (
          <div>Loading...</div>
        ) : visibleProjects.length === 0 ? (
          <div>No applied projects found.</div>
        ) : (
          <div className="projects-grid">
            {visibleProjects.map((project) => {
              const myApp = project.applicants.find(
                (a) => a.user?._id === user._id
              );
              return (
                <div key={project._id} className="project-card">
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <p>
                    <strong>Budget:</strong> ₹{project.budget?.toLocaleString()}
                  </p>
                  <p>
                    <strong>Status:</strong> {project.status}
                  </p>
                  <p>
                    <strong>Your Pitch:</strong>
                    <br />
                    <span style={{ fontStyle: "italic", color: "#2d3a4a" }}>
                      {myApp?.pitch}
                    </span>
                  </p>
                  <button
                    onClick={() => navigate(`/pro-projects/${project._id}`)}
                    className="btn-primary"
                  >
                    View Details
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
