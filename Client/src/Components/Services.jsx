// Services.jsx
import React from 'react';
import '../Styles/Services.css';

const Services = () => {
  return (
    <section className="services-section">
      <h2>Find the right talent for every job</h2>
      <div className="services-grid">
        <div className="service-card">
          <img
            src="https://plus.unsplash.com/premium_photo-1661342406124-740ae7a0dd0e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fHBsdW1iaW5nfGVufDB8fDB8fHww"
            alt="Plumbing service"
            className="service-image"
          />
          <p>Find experienced plumbers for quick and reliable solutions.</p>
        </div>
        <div className="service-card">
          <img
            src="https://images.unsplash.com/photo-1632910121591-29e2484c0259?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHRlY2huaWNhbCUyMHN1cHBvcnR8ZW58MHx8MHx8fDA%3D"
            alt="Technical support"
            className="service-image"
          />
          <p>Get immediate assistance from tech experts for your devices.</p>
        </div>
        <div className="service-card">
          <img
            src="https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8d2ViJTIwZGV2ZWxvcG1lbnR8ZW58MHx8MHx8fDA%3D"
            alt="Web development"
            className="service-image"
          />
          <p>Connect with talented developers for your online projects.</p>
        </div>
      </div>
    </section>
  );
};

export default Services;
