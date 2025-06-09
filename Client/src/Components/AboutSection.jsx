import React from 'react';
import { motion } from 'framer-motion';
import '../Styles/AboutSection.css';

const AboutSection = () => {
  const features = [
    {
      icon: "🎯",
      title: "Precision Matching",
      description: "Our AI-powered system matches you with the perfect freelancer for your project needs."
    },
    {
      icon: "⚡",
      title: "Quick Turnaround",
      description: "Get your projects completed faster with our efficient workflow and communication tools."
    },
    {
      icon: "🛡️",
      title: "Secure Platform",
      description: "Your data and payments are protected with enterprise-grade security measures."
    },
    {
      icon: "💎",
      title: "Quality Assured",
      description: "Every freelancer is vetted and verified to ensure top-notch quality work."
    }
  ];

  return (
    <section className="about-section">
      <div className="about-container">
        <motion.div 
          className="about-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">
            Why Choose <span className="highlight">SkillHire</span>
          </h2>
          <p className="section-description">
            We're revolutionizing the way businesses connect with talented professionals.
            Experience a seamless hiring process that saves time and delivers results.
          </p>
        </motion.div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="feature-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="about-cta"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <button className="cta-button">Join Our Platform</button>
          <p className="cta-subtext">Start your journey with SkillHire today</p>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
