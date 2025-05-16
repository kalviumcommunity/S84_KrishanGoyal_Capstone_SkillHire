// Testimonials.jsx
import React from 'react';
import '../Styles/Testimonials.css';

const Testimonials = () => {
  return (
    <section className="testimonials-section" id="testimonials">
      <h2>Hear from Our Users</h2>
      <div className="testimonials-grid">
        <div className="testimonial-card">
          <p className="quote">
            “I found a certified plumber within 15 minutes. Super convenient!”
          </p>
          <h4>Raj</h4>
          <span>Mumbai</span>
        </div>
        <div className="testimonial-card">
          <p className="quote">
            “The platform made hiring a developer for my app a breeze!”
          </p>
          <h4>Priya</h4>
          <span>Bangalore</span>
        </div>
        <div className="testimonial-card">
          <p className="quote">
            “I started freelancing here and already landed 3 clients!”
          </p>
          <h4>Karan</h4>
          <span>Delhi</span>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;