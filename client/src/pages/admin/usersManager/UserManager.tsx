/* eslint-disable react-refresh/only-export-components */
import Table from '../../../components/UI/Table';
import Title from '../../../components/UI/Title';
import TableAction from '../../../components/UI/TableAction';
import TableCard from '../../../components/UI/TableCard';
import {
  extractFormData,
  extractParams,
  getData,
  patchData,
  queryClient,
} from '../../../helperFunc.ts/apiRequest';
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  useLoaderData,
} from 'react-router-dom';
import { User } from '../../../dtos/UserDto';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { formatDate } from '../../../helperFunc.ts/utilsFunc';
import Empty from '../../../components/UI/Empty';

const UserManager = () => {
  const params = useLoaderData();

  const { data } = useQuery({
    queryKey: [
      'fetchUser',
      'users',
      params?.page ?? 1,
      params?.sort ?? '-createdAt',
    ],
    queryFn: () =>
      getData({
        url: `/users?page=${params?.page || 1}&sort=${
          params?.sort || '-createdAt'
        }`,
      }),
  });

  const { users }: { users: User[] } = data || [];

  //  const { totalPages, currentPage, nextPage, previousPage } = data.page;

  const headers = ['username', 'email', 'reg date', 'action'];
  const columns = '1fr 1fr 1fr 1.2fr';
  return (
    <section>
      <Title title='manage users' />
      {/* Large screen table view */}
      {users?.length > 0 ? (
        <div className='w-full overflow-x-auto hidden lg:block'>
          <Table headers={headers} columns={columns}>
            {users?.map((user) => (
              <React.Fragment key={user._id}>
                <p className='border border-[#d1d5dc] capitalize '>
                  {user?.surname} {user?.otherNames.split(' ')[0]}
                </p>
                <p className='border lowercase border-[#d1d5dc] '>
                  {user?.email}
                </p>
                <p className='border  border-[#d1d5dc] '>
                  {user?.createdAt && formatDate(new Date(user?.createdAt))}
                </p>
                <TableAction
                  editUrl={`/account/admin/user-manager/edit/${user?.userRef}`}
                  viewUrl={`/account/admin/user-manager/view/${user?.userRef}`}
                  showUserAction
                  userStatus={user?.status}
                  id={user?.userRef}
                />
              </React.Fragment>
            ))}
          </Table>
        </div>
      ) : (
        <Empty message='No user data in our records.' />
      )}
      {/*End Large screen table view */}
      {/*================= Small screen table view =============== */}
      {users?.length > 0 ? (
        <div className='block lg:hidden'>
          {/* Table card header */}
          <TableCard className='font-600 uppercase'>
            <p>username</p>
            <p className='break-all'>email</p>
            <p>reg date</p>
          </TableCard>
          {/* Table card row */}
          {users?.map((user) => (
            <TableCard
              key={user._id}
              editUrl={`/account/admin/user-manager/edit/${user?.userRef}`}
              viewUrl={`/account/admin/user-manager/view/${user?.userRef}`}
              showAction
              userStatus={user?.status}
              id={user?.userRef}
            >
              <p className='capitalize'>
                {user?.surname} {user?.otherNames.split(' ')[0]}
              </p>
              <p className='break-all'> {user?.email}</p>
              <p>{user?.createdAt && formatDate(new Date(user?.createdAt))}</p>
            </TableCard>
          ))}
        </div>
      ) : (
        <Empty message='No user data in our records.' />
      )}
      {/*End Small screen table view */}
    </section>
  );
};

export default UserManager;

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const params = extractParams(request);
  const { page, sort } = params;
  await queryClient.ensureQueryData({
    queryKey: ['fetchUser', 'users', page ?? 1, sort ?? '-createdAt'],
    queryFn: () =>
      getData({
        url: `/users?page=${page || 1}&sort=${sort || '-createdAt'}`,
      }),
  });

  return params;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const result = await extractFormData(request);

  queryClient.invalidateQueries({ queryKey: ['fetchUser'] });
  return patchData({
    url: `/users/${result.id}`,
    data: { status: result.status },
    setToast: true,
    invalidate: ['fetchUser'],
    redirectTo: '/account/admin/user-manager',
  });
};
