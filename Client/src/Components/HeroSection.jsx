import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import '../Styles/HeroSection.css';

const HeroSection = () => {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const y = useTransform(scrollY, [0, 300], [0, 100]);

  return (
    <section className="hero-section">
      <div className="hero-background">
        <div className="gradient-sphere sphere-1"></div>
        <div className="gradient-sphere sphere-2"></div>
        <div className="gradient-sphere sphere-3"></div>
        <div className="floating-shapes">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="floating-shape"
              initial={{ y: -100, opacity: 0 }}
              animate={{ 
                y: [0, -15, 0],
                opacity: [0.3, 0.6, 0.3],
                rotate: [0, 180]
              }}
              transition={{
                duration: 8 + i,
                repeat: Infinity,
                delay: i * 1,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </div>
      
      <motion.div 
        className="hero-content"
        style={{ opacity, y }}
      >
        <motion.div 
          className="hero-text"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="brand-logo"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1 className="website-name">SkillHire</h1>
            <div className="brand-tagline">Where Talent Meets Opportunity</div>
          </motion.div>

          <motion.h2 
            className="hero-heading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Find Your Perfect
            <span className="highlight"> Freelance Expert</span>
          </motion.h2>

          <motion.p 
            className="hero-description"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Connect with top professionals and get your projects done with excellence.
            From web development to creative design, we've got you covered.
          </motion.p>
          
          <motion.div 
            className="hero-cta"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <motion.button 
              className="cta-primary"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Get Started
            </motion.button>
            <motion.button 
              className="cta-secondary"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Learn More
            </motion.button>
          </motion.div>
        </motion.div>

        <motion.div 
          className="hero-stats"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="stat-card">
            <span className="stat-number">10K+</span>
            <span className="stat-label">Active Freelancers</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">5K+</span>
            <span className="stat-label">Completed Projects</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">98%</span>
            <span className="stat-label">Client Satisfaction</span>
          </div>
        </motion.div>
      </motion.div>

      <motion.div 
        className="scroll-indicator"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        <div className="mouse">
          <div className="wheel"></div>
        </div>
        <div className="arrow">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
