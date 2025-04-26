import { FaAngleDown, FaBars, FaHome, FaLock, FaUserAlt } from 'react-icons/fa';
import { dashboardActions } from '../../Actions/DashboardAction';
import { useAppDispatch, useAppSelector } from '../../Actions/store';
import { Link } from 'react-router-dom';
import SiteMode from './SiteMode';
import { CiLogout } from 'react-icons/ci';
import { useState } from 'react';

const TopNav = () => {
  const [isAuthMenuOpen, setIsAuthMenuOpen] = useState(false);
  const dispatch = useAppDispatch();
  const { isSidebarOpen } = useAppSelector((state) => state.ui);

  // Toggle sidebar class names
  const showNavLg = isSidebarOpen
    ? 'lg:w-full lg:ml-0'
    : 'lg:w-[calc(100% - 252px)] lg:ml-63';

  return (
    <nav
      className={` ml-0 ${showNavLg} h-[66px] border-b-2 border-primary-500 dark:border-amber-500 transition-all duration-700 ease-in-out px-3 sticky top-0 left-0 dark:bg-slate-800 bg-white z-6 flex items-center`}
    >
      <div className='container mx-auto py-2 px-4 flex justify-between items-center'>
        {/* Sidebar toggle menu */}
        <FaBars
          className='text-2xl text-primary-500 dark:text-slate-50'
          onClick={() => dispatch(dashboardActions.toggleSidebar())}
        />
        {/* Brand logo */}

        <Link
          title='Back to Home'
          to='/'
          className='flex items-center gap-1 text-2xl text-primary-500 dark:text-slate-50'
        >
          <FaHome className='text-green-500' />

          <span className='font-700 hidden lg:block'>Letango</span>
        </Link>

        {/*=================================================================================
        ========================= Top nav menu ===================================== */}
        <div className='flex items-center gap-4'>
          <SiteMode />
          {/* Dropdown menu */}
          <div className='relative'>
            <div
              className='flex items-center cursor-pointer authbox'
              onClick={() => setIsAuthMenuOpen(!isAuthMenuOpen)}
            >
              <span className='mt-1 dark:text-slate-50 authbox'>
                {`Osunkoya`.charAt(0).toUpperCase()}
                {`mayowa`.charAt(0).toUpperCase()}
              </span>
              <FaAngleDown className='mt-1 dark:text-slate-50 authbox' />
            </div>
            {/* Dropdown menu for profile */}
            <ul
              className={`absolute top-[160%]  text-sm w-38 bg-slate-100 dark:bg-slate-800  dark:text-slate-50 p-2 invisible right-0 ${
                isAuthMenuOpen ? 'visible' : 'right-1'
              } transition-all duration-500`}
            >
              <li className='pt-2 mb-5'>
                <Link
                  to='/account/profile'
                  className='flex items-baseline hover:text-amber-600'
                >
                  <FaUserAlt />
                  <span className='ml-1'>Profile</span>
                </Link>
              </li>
              <li className='mb-5'>
                <Link
                  to='/account/profile/change-password'
                  className='flex items-baseline'
                >
                  <FaLock />
                  <span className='ml-1'>Change Password</span>
                </Link>
              </li>
              <li>
                <button className='flex items-baseline'>
                  <CiLogout />
                  <span className='ml-1'>Logout</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopNav;
