import HeroSection from '../Components/HeroSection';
import AboutSection from '../Components/AboutSection';
import Services from '../Components/Services';
import PricingPlans from '../Components/PricingPlans';
import HowItWorks from '../Components/HowItWorks';
import ContactForm from '../Components/ContactForm';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import Testimonials from '../Components/Testimonials';
import { useEffect, useState } from 'react';
import '../Styles/LandingPageAnimations.css';

const LandingPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    window.history.pushState(null, '', window.location.href);
    const onPopState = () => {
      window.history.pushState(null, '', window.location.href);
    };
    window.addEventListener('popstate', onPopState);

    const timer = setTimeout(() => {
      setIsLoaded(true);
      setTimeout(() => {
        setIsAnimating(false);
      }, 2000);
    }, 100);

    return () => {
      window.removeEventListener('popstate', onPopState);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className={`landing-page ${isLoaded ? 'loaded' : ''} ${isAnimating ? 'animating' : ''}`}>
      <div className="landing-bg">
        <div className="curtain-overlay"></div>
        <Navbar className="landing-content landing-nav" />
        <HeroSection className="landing-content landing-hero" />
        <AboutSection className="landing-content landing-about" />
        <Services className="landing-content landing-services" />
        <PricingPlans className="landing-content landing-pricing" />
        <HowItWorks className="landing-content landing-how-it-works" />
        <Testimonials className="landing-content landing-testimonials" />
        <ContactForm className="landing-content landing-contact" />
        <Footer className="landing-content landing-footer" />
      </div>
    </div>
  );
};

export default LandingPage;