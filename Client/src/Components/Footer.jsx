// Footer.jsx
import React from 'react';
import '../Styles/Footer.css';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="footer-column">
          <h4>Company</h4>
          <a href="#">About Us</a>
          <a href="#">Careers</a>
          <a href="#">Press</a>
          <a href="#">Blog</a>
        </div>
        <div className="footer-column">
          <h4>Resources</h4>
          <a href="#">Schedule Appointment</a>
          <a href="#">Complete Intake</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Use</a>
        </div>
        <div className="footer-column">
          <h4>Skills</h4>
          <a href="#">Web Development</a>
          <a href="#">Graphic Design</a>
          <a href="#">Technical Support</a>
          <a href="#">Plumbing</a>
        </div>
        <div className="footer-column">
          <h4>Contact</h4>
          <p>Email: support@skillhire.com</p>
          <p>Phone: +91 98765 43210</p>
          <p>Address: 123 Workforce St, Mumbai, IN</p>
          <div className="footer-socials">
            <a href="#">Facebook</a>
            <a href="#">LinkedIn</a>
            <a href="#">Twitter</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>Skill Hire © {new Date().getFullYear()} — Empowering India's Workforce with Talent & Opportunity</p>
      </div>
    </footer>
  );
};

export default Footer;
