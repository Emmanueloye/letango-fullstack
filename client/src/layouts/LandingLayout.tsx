import { useEffect, useState } from 'react';
import Footer from '../components/HomeSections/Footer';
import HomeNav from '../components/Navigation/HomeNav';
import {
  Outlet,
  ScrollRestoration,
  useNavigate,
  useNavigation,
} from 'react-router-dom';
import { useAppDispatch } from '../Actions/store';
import { fetchOnlyData } from '../helperFunc.ts/apiRequest';
import { authActions } from '../Actions/authAction';
import Loader from '../components/UI/Loader';
import { User } from '../dtos/UserDto';

const LandingLayout = () => {
  const [user, setUser] = useState<User>();
  const dispatch = useAppDispatch();
  const { state } = useNavigation();
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      const response = await fetchOnlyData({ url: '/users/me' });

      if (response.status === 'success') {
        setUser(response.user);
        dispatch(authActions.updateAuth(true));
      } else {
        navigate('/');
        dispatch(authActions.updateAuth(false));
      }
    };

    loadUser();
  }, [dispatch]);

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
        user={user}
      />
      {/* Main contents */}
      <main className='min-h-screen'>
        {state === 'loading' && <Loader />}
        {state === 'submitting' && <Loader />}
        <Outlet />
      </main>
      {/* Footer */}
      <Footer scrollToSection={scrollToSection} />
      <ScrollRestoration />
    </>
  );
};

export default LandingLayout;
