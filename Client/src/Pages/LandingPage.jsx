import HeroSection from '../Components/HeroSection';
import AboutSection from '../Components/AboutSection';
import Services from '../Components/Services';
import PricingPlans from '../Components/PricingPlans';
import HowItWorks from '../Components/HowItWorks';
import ContactForm from '../Components/ContactForm';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import Testimonials from '../Components/Testimonials';

const LandingPage = () => {
  return (
    <>
      <Navbar />
      <HeroSection />
      <AboutSection />
      <Services />
      <PricingPlans />
      <HowItWorks />
      <Testimonials />
      <ContactForm />
      <Footer />
    </>
  );
};

export default LandingPage