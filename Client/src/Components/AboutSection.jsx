// AboutSection.jsx
import React from "react";
import "../Styles/AboutSection.css";

const AboutSection = () => {
  return (
    <section className="about-section">
      <div className="about-content">
        <div className="about-text">
          <h2>Your go-to platform for skilled services</h2>
          <p>
            Skill Hire is your ultimate web-based platform designed to
            streamline connections between clients and service providers.
            Whether local or remote, find and hire quickly, securely, and
            efficiently.
          </p>
          <a href="#contact">Get in touch</a>
        </div>
        <div className="about-image">
          <img
            src="https://images.unsplash.com/photo-1712903276265-952cee2dd1be?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHByb2Zlc3Npb25hbHN8ZW58MHx8MHx8fDA%3D"
            alt="Team working together"
          />
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
