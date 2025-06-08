import React from 'react';
import '../Styles/HeroSection.css';

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="overlay"></div>
      <div className="hero-text">
        <h1>Connect with experts</h1>
        <p>Find the best services for your needs</p>
        <button className="hero-button">View Services</button>
      </div>
    </section>
  );
};

export default HeroSection;
