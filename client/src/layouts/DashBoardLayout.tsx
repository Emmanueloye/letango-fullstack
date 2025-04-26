import { Outlet, ScrollRestoration } from 'react-router-dom';
import SideBar from '../components/Navigation/SideBar';
import TopNav from '../components/Navigation/TopNav';
import { useAppSelector } from '../Actions/store';

const DashBoardLayout = () => {
  const { isSidebarOpen } = useAppSelector((state) => state.ui);

  const adjustMain = isSidebarOpen
    ? 'lg:w-full lg:ml-0'
    : 'lg:w-[calc(100% - 252px)] lg:ml-63';
  return (
    <>
      <SideBar />
      <TopNav />
      <main
        className={`dark:bg-slate-700 min-h-screen ml-0 ${adjustMain} transition-all duration-700 ease-in-out py-6 lg:px-8 px-2 dark:text-slate-50`}
      >
        <Outlet />
      </main>
      <ScrollRestoration />
    </>
  );
};

export default DashBoardLayout;
