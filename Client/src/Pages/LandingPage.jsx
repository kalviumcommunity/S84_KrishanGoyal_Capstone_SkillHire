import HeroSection from '../Components/HeroSection';
import AboutSection from '../Components/AboutSection';
import Services from '../Components/Services';
import PricingPlans from '../Components/PricingPlans';
import HowItWorks from '../Components/HowItWorks';
import ContactForm from '../Components/ContactForm';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import Testimonials from '../Components/Testimonials';
import { useEffect, useState, useRef } from 'react';
import '../Styles/LandingPageAnimations.css';
import '../Styles/LandingPage.css';

const LandingPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(true);
  const [visibleSections, setVisibleSections] = useState({});
  const sectionsRef = useRef([]);

  useEffect(() => {
    // Initial page load animation
    const timer = setTimeout(() => {
      setIsLoaded(true);
      setTimeout(() => {
        setIsAnimating(false);
      }, 2000);
    }, 100);

    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => ({
              ...prev,
              [entry.target.id]: true,
            }));
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    // Observe all sections
    sectionsRef.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  const sections = [
    { id: 'hero', Component: HeroSection, className: 'landing-hero' },
    { id: 'about', Component: AboutSection, className: 'landing-about' },
    { id: 'services', Component: Services, className: 'landing-services' },
    { id: 'pricing', Component: PricingPlans, className: 'landing-pricing' },
    { id: 'how-it-works', Component: HowItWorks, className: 'landing-how-it-works' },
    { id: 'testimonials', Component: Testimonials, className: 'landing-testimonials' },
    { id: 'contact', Component: ContactForm, className: 'landing-contact' },
  ];

  return (
    <div className={`landing-page ${isLoaded ? 'loaded' : ''} ${isAnimating ? 'animating' : ''}`}>
      <div className="landing-bg">
        <div className="curtain-overlay"></div>
        <Navbar className="landing-content landing-nav" />
        
        {sections.map(({ id,className }, index) => (
          <section
            key={id}
            id={id}
            ref={(el) => (sectionsRef.current[index] = el)}
            className={`section ${className} ${visibleSections[id] ? 'visible' : ''}`}
          >
            <Component />
          </section>
        ))}
        
        <Footer className="landing-content landing-footer" />
      </div>
    </div>
  );
};

export default LandingPage;