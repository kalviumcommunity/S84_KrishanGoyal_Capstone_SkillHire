import React, { useState, useEffect } from 'react';
import '../Styles/Navbar.css';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['how-it-works', 'testimonials'];
      const scrollPos = window.scrollY + 100;

      for (let id of sections) {
        const section = document.getElementById(id);
        if (section) {
          const top = section.offsetTop;
          const bottom = top + section.offsetHeight;
          if (scrollPos >= top && scrollPos < bottom) {
            setActiveLink(id);
            return;
          }
        }
      }
      setActiveLink('');
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

   return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="navbar-logo">
          <img 
            src='./SkillHireLogo.png' 
            alt="SkillHire Logo" 
            className="logo-img" 
            onClick={() => navigate('/')}
            style={{ cursor: 'pointer' }}
          />
        </div>
        <div className={`navbar-links ${menuOpen ? 'active' : ''}`}>
          <a
            href="#how-it-works"
            className={activeLink === 'how-it-works' ? 'active-link' : ''}
            onClick={() => setMenuOpen(false)}
          >
            How It Works
          </a>
          <a
            href="#testimonials"
            className={activeLink === 'testimonials' ? 'active-link' : ''}
            onClick={() => setMenuOpen(false)}
          >
            Testimonials
          </a>
          <button className="login-btn" onClick={() => {setMenuOpen(false); navigate('/login')}}>Login</button>
          <button
            className="signup-btn"
            onClick={() => {
              setMenuOpen(false);
              navigate('/signup');
            }}
          >
            Sign Up
          </button>
        </div>
        <div
          className={`hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          role="button"
          tabIndex={0}
          onKeyDown={e => (e.key === 'Enter' ? setMenuOpen(!menuOpen) : null)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;