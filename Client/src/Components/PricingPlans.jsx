// PricingPlans.jsx
import React from 'react';
import '../Styles/PricingPlans.css';

const PricingPlans = () => {
  return (
    <section className="pricing-section">
      <h2>Flexible pricing for every need</h2>
      <div className="pricing-grid">
        <div className="pricing-card">
          <img
            src="https://images.unsplash.com/photo-1602629726749-61bfe80aadca?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8c2hvcnQlMjBqb2JzfGVufDB8fDB8fHww"
            alt="Short jobs"
            className="pricing-image"
          />
          <h3>Go for short jobs</h3>
          <p>Quick solutions for everyday tasks. Free.</p>
          <button>Read More</button>
        </div>
        <div className="pricing-card">
          <img
            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=600&q=80"
            alt="Pro Projects"
            className="pricing-image"
          />
          <h3>Pro for professional projects</h3>
          <p>Flexible long-term project hiring. ₹25/month.</p>
          <button>Read More</button>
        </div>
        <div className="pricing-card">
          <img
            src="https://plus.unsplash.com/premium_photo-1661486971635-b79537d79d97?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fHNraWxsJTIwbWF0Y2glMjByYXRpbmdzfGVufDB8fDB8fHww"
            alt="Skill ratings"
            className="pricing-image"
          />
          <h3>Skill match ratings</h3>
          <p>Make informed hiring decisions with ratings & insights.</p>
          <button>Read More</button>
        </div>
      </div>
    </section>
  );
};

export default PricingPlans;