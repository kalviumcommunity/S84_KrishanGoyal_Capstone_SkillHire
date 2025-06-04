import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import NavbarDashboards from "../Components/NavbarDashboards";
import { useNavigate } from "react-router-dom";

export default function YourProjects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/pro-projects/my/${user._id}`,
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
    if (user?._id) fetchProjects();
  }, [user]);

  return (
    <div>
      <NavbarDashboards />
      <div className="dashboard-container">
        <h2>Your Projects</h2>
        {loading ? (
          <div>Loading...</div>
        ) : projects.length === 0 ? (
          <div style={{ color: "#888", fontSize: "1.2rem", marginTop: "2rem" }}>
            You haven't posted any projects yet.
          </div>
        ) : (
          <div className="projects-grid">
            {projects.map((project) => (
              <div key={project._id} className="project-card">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <p>
                  <strong>Status:</strong> {project.status}
                </p>
                <button
                  onClick={() => navigate(`/pro-projects/${project._id}`)}
                  className="btn-primary"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}