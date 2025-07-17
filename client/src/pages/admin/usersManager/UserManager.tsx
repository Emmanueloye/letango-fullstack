/* eslint-disable react-refresh/only-export-components */

import Title from '../../../components/UI/Title';
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
import { TableUser } from '../../../dtos/UserDto';
import { useQuery } from '@tanstack/react-query';
import { formatDate } from '../../../helperFunc.ts/utilsFunc';
import Empty from '../../../components/UI/Empty';
import Pagination from '../../../components/UI/Pagination';
import DataTableUI, { Row } from '../../../components/UI/DataTable';
import TableAction from '../../../components/UI/TableAction';

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
        url: `/users?page=${params?.page || 1}&limit=12&sort=${
          params?.sort || '-createdAt'
        }`,
      }),
  });

  const { users }: { users: TableUser[] } = data || [];

  const updatedUsers = users?.map((item) => {
    if (item.createdAt) item.createdAt.toString();
    return item;
  });

  const { totalPages, currentPage, nextPage, previousPage } = data.page;

  const columns = [
    {
      name: 'USER NAME',
      cell: (row: Row) => (
        <div
          style={{ textTransform: 'capitalize' }}
        >{`${row.surname} ${row.otherNames}`}</div>
      ),
      sortable: true,
    },
    {
      name: 'EMAIL',
      selector: (row: Row) => row.email,
      sortable: true,
    },
    {
      name: 'REG DATE',
      cell: (row: Row) => (
        <div>{formatDate(new Date(row.createdAt?.toLocaleString()))}</div>
      ),
      sortable: true,
    },
    {
      name: 'ACTION',
      cell: (row: Row) => {
        return (
          <TableAction
            editUrl={`/account/admin/user-manager/edit/${row?.userRef}`}
            viewUrl={`/account/admin/user-manager/view/${row?.userRef}`}
            showUserAction
            userStatus={row?.status as string}
            id={row?._id as string}
            userRef={row?.userRef as string}
          />
        );
      },
    },
  ];

  return (
    <section>
      <Title title='manage users' />

      {users?.length > 0 ? (
        <div className='block'>
          {/* Table card row */}
          <DataTableUI
            columns={columns || []}
            data={updatedUsers}
            pagination={false}
          />

          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            previousPage={previousPage}
            nextPage={nextPage}
            baseLink='/account/admin/user-manager'
          />
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
        url: `/users?page=${page || 1}&limit=12&sort=${sort || '-createdAt'}`,
      }),
  });

  return params;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const result = await extractFormData(request);

  queryClient.invalidateQueries({ queryKey: ['fetchUser'] });

  return patchData({
    url: `/users/${result.userRef}`,
    data: { status: result.status },
    setToast: true,
    invalidate: ['fetchUser'],
    redirectTo: '/account/admin/user-manager',
  });
};
