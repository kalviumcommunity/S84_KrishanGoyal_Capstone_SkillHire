import HeroSection from '../Components/HeroSection';
import AboutSection from '../Components/AboutSection';
import Services from '../Components/Services';
import PricingPlans from '../Components/PricingPlans';
import HowItWorks from '../Components/HowItWorks';
import ContactForm from '../Components/ContactForm';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import Testimonials from '../Components/Testimonials';
import { useEffect } from 'react';

const LandingPage = () => {

   useEffect(() => {
    window.history.pushState(null, '', window.location.href);

    const onPopState = () => {
      window.history.pushState(null, '', window.location.href);
    };

    window.addEventListener('popstate', onPopState);

    return () => {
      window.removeEventListener('popstate', onPopState);
    };
  }, []);

  return (
    <div className="landing-page">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <Services />
      <PricingPlans />
      <HowItWorks />
      <Testimonials />
      <ContactForm />
      <Footer />
    </div>
  );
};

export default LandingPage;