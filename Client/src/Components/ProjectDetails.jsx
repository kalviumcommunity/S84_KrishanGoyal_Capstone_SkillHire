import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import '../Styles/ProjectDetails.css';

const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const ProjectDetails = ({ type }) => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        setError(null);

        const endpoint = `${baseUrl}/api/${type}-projects/${projectId}`;
        const response = await axios.get(endpoint, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
          withCredentials: true,
        });

        const projectData = response.data.project || 
                          (response.data.projects && response.data.projects[0]);

        if (!projectData) {
          throw new Error('Project data not found in response');
        }

        setProject(projectData);
      } catch (err) {
        setError(
          err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          'Failed to load project'
        );
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchProject();
    }
  }, [type, projectId]);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'yet to be assigned': return 'status-pending';
      case 'assigned but not completed': return 'status-in-progress';
      case 'completed': return 'status-completed';
      default: return '';
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
          <button onClick={() => navigate('/client')} className="back-btn">
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
          <button onClick={() => navigate('/client')} className="back-btn">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="project-details-container">
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

        {type === 'go' ? (
          <div className="go-project-details">
            <div className="detail-section">
              <h3>Location</h3>
              <p>{project.city}{project.subCity ? `, ${project.subCity}` : ''}</p>
            </div>
            <div className="detail-section">
              <h3>Category</h3>
              <p>{project.category}</p>
            </div>
            <div className="detail-section">
              <h3>Posted On</h3>
              <p>{new Date(project.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        ) : (
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
              <p>{project.applicants?.length || 0}</p>
            </div>
          </div>
        )}

        {project.status === 'assigned but not completed' && project.assignedTo && (
          <div className="assigned-section">
            <h3>Assigned To</h3>
            <p>{project.assignedTo.name || project.assignedTo.email}</p>
          </div>
        )}

        <div className="project-actions">
          <button onClick={() => navigate('/client')} className="back-btn">
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;