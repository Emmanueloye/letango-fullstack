/* eslint-disable react-refresh/only-export-components */
import {
  Outlet,
  redirect,
  ScrollRestoration,
  useLoaderData,
  useNavigate,
  useNavigation,
} from 'react-router-dom';
import SideBar from '../components/Navigation/SideBar';
import TopNav from '../components/Navigation/TopNav';
import { useAppDispatch, useAppSelector } from '../Actions/store';
import {
  deleteData,
  fetchOnlyData,
  queryClient,
} from '../helperFunc.ts/apiRequest';
import { useEffect } from 'react';
import { authActions } from '../Actions/authAction';
import { toast } from 'react-toastify';
import Loader from '../components/UI/Loader';

const DashBoardLayout = () => {
  const { isSidebarOpen } = useAppSelector((state) => state.ui);

  const navigate = useNavigate();
  const { state } = useNavigation();
  const dispatch = useAppDispatch();
  const data = useLoaderData();

  useEffect(() => {
    if (data.status === 'success') {
      dispatch(authActions.updateAuth(true));
    }
  }, [data.status, dispatch]);

  const logout = async () => {
    const result = await deleteData({
      url: '/auth/logout',
    });

    if (result.status === 'success') {
      queryClient.invalidateQueries();
      dispatch(authActions.updateAuth(false));

      toast.success('You are logged out. See you soon.');
      navigate('/');
    }
  };

  const adjustMain = isSidebarOpen
    ? 'lg:w-full lg:ml-0'
    : 'lg:w-[calc(100% - 252px)] lg:ml-63';
  return (
    <>
      <SideBar user={data.user} />
      <TopNav user={data.user} logout={logout} />
      <main
        className={`dark:bg-slate-700 min-h-screen ml-0 ${adjustMain} transition-all duration-700 ease-in-out py-6 lg:px-8 px-2 dark:text-slate-50`}
      >
        {state === 'loading' && <Loader />}
        {state === 'submitting' && <Loader />}
        <Outlet context={data.user} />
      </main>
      <ScrollRestoration />
    </>
  );
};

export default DashBoardLayout;

export const loader = async () => {
  const response = await fetchOnlyData({ url: '/users/me' });
  if (response.status === 'fail') {
    return redirect('/login');
  }
  return response;
};
