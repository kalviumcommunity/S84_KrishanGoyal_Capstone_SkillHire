import React from 'react';
import '../Styles/HowItWorks.css';

const HowItWorks = () => {
  return (
    <section className="how-section" id='how-it-works'>
      <h2>Connect with skilled professionals effortlessly.</h2>
      <div className="how-grid">
        <div className="how-card">
          <img
            src="https://plus.unsplash.com/premium_photo-1664300982961-f57190dca362?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8bGFib3VyJTIwd29ya3xlbnwwfHwwfHx8MA%3D%3D"
            alt="Post a Job"
            className="how-image"
          />
          <p>Post your job and connect with qualified service providers.</p>
        </div>
        <div className="how-card">
          <img
            src="https://images.unsplash.com/photo-1577716334258-196a0c967a7c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8aGlyZSUyMGElMjBwcm98ZW58MHx8MHx8fDA%3D"
            alt="Hire a Pro"
            className="how-image"
          />
          <p>Select the best professional for your project.</p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
