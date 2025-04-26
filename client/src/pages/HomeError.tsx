import { useState } from 'react';
import HomeNav from '../components/Navigation/HomeNav';
import Footer from '../components/HomeSections/Footer';
import ErrorDeck from '../components/UI/ErrorDeck';
import { useLocation, useNavigate } from 'react-router-dom';

const HomeError = () => {
  const path = useLocation();
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState<string>('home');
  const scrollToSection = (sectionId: string) => {
    // The links the function is attached to are buttons and will do nothing when on error page.
    //This condition make it so that if we are not on home page, take us back to home page.
    if (path.pathname !== '/') {
      navigate('/');
    }

    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(sectionId);
    }
  };
  return (
    <div>
      {/* Navbar */}
      <HomeNav
        scrollToSection={scrollToSection}
        activeSection={activeSection}
      />
      <ErrorDeck />
      <Footer scrollToSection={scrollToSection} />
    </div>
  );
};

export default HomeError;
