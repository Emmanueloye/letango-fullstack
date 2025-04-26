import { useState } from 'react';
import Footer from '../components/HomeSections/Footer';
import HomeNav from '../components/Navigation/HomeNav';
import { Outlet, ScrollRestoration } from 'react-router-dom';

const LandingLayout = () => {
  const [activeSection, setActiveSection] = useState<string>('home');
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(sectionId);
    }
  };
  return (
    <>
      {/* Navbar */}
      <HomeNav
        scrollToSection={scrollToSection}
        activeSection={activeSection}
      />
      {/* Main contents */}
      <main className='min-h-screen'>
        <Outlet />
      </main>
      {/* Footer */}
      <Footer scrollToSection={scrollToSection} />
      <ScrollRestoration />
    </>
  );
};

export default LandingLayout;
