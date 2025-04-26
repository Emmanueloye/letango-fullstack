import { NavLink, Outlet } from 'react-router-dom';

const ProfileLayout = () => {
  return (
    <>
      <div className='flex justify-center flex-wrap *:mr-1'>
        <NavLink
          to='/account/profile'
          end
          className={({ isActive }) =>
            isActive
              ? 'bg-green-600 dark:bg-green-600 rounded-t-md px-8 py-2 text-slate-50 text-sm'
              : 'bg-primary-500 dark:bg-slate-800 rounded-t-md px-8 py-2 text-slate-50 text-sm'
          }
        >
          Profile
        </NavLink>
        <NavLink
          to='/account/profile/edit-profile'
          className={({ isActive }) =>
            isActive
              ? 'bg-green-600 dark:bg-green-600 rounded-t-md px-8 py-2 text-slate-50 text-sm'
              : 'bg-primary-500 dark:bg-slate-800 rounded-t-md px-8 py-2 text-slate-50 text-sm'
          }
        >
          Edit Profile
        </NavLink>
        <NavLink
          to='/account/profile/change-password'
          className={({ isActive }) =>
            isActive
              ? 'bg-green-600 dark:bg-green-600 rounded-t-md px-8 py-2 text-slate-50 text-sm'
              : 'bg-primary-500 dark:bg-slate-800 rounded-t-md px-8 py-2 text-slate-50 text-sm'
          }
        >
          Update Password
        </NavLink>
      </div>
      <Outlet />
    </>
  );
};

export default ProfileLayout;
