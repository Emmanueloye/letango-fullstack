/* eslint-disable react-refresh/only-export-components */
import { LoaderFunctionArgs, useLoaderData } from 'react-router-dom';
import Title from '../../../components/UI/Title';
import {
  extractParams,
  getData,
  queryClient,
} from '../../../helperFunc.ts/apiRequest';
import { useQuery } from '@tanstack/react-query';
import { UpdatedGroup } from '../../../dtos/groupDto';
import DataTableUI, { Row } from '../../../components/UI/DataTable';
import TableAction from '../../../components/UI/TableAction';
import Empty from '../../../components/UI/Empty';
import Pagination from '../../../components/UI/Pagination';

const GroupManager = () => {
  const params = useLoaderData();

  const { data } = useQuery({
    queryKey: [
      'fetchAllGroup',
      'allGroups',
      params?.page ?? 1,
      params?.sort ?? '-createdAt',
    ],
    queryFn: () =>
      getData({
        url: `/groups?page=${params?.page || 1}&limit=12&sort=${
          params?.sort || '-createdAt'
        }`,
      }),
  });

  const { groups }: { groups: UpdatedGroup[] } = data || [];

  const { totalPages, currentPage, nextPage, previousPage } = data?.page || {};

  const columns = [
    {
      name: 'GROUP REF',
      selector: (row: Row) => row.groupRef,
      sortable: true,
    },
    {
      name: 'GROUP NAME',
      cell: (row: Row) => (
        <div style={{ textTransform: 'capitalize' }}>{row.groupName}</div>
      ),
      sortable: true,
    },
    {
      name: 'GROUP TYPE',
      selector: (row: Row) => row.groupType,
      sortable: true,
    },

    {
      name: 'ACTION',
      cell: (row: Row) => {
        return (
          <TableAction
            editUrl={`/account/admin/group-manager/edit/${row?.groupRef}`}
            viewUrl={`/account/admin/group-manager/view/${row?.groupRef}`}
            id={row?._id as string}
          />
        );
      },
    },
  ];

  return (
    <section>
      <Title title='manage groups' />

      {groups?.length > 0 ? (
        <div className='block'>
          {/* Table */}
          <DataTableUI columns={columns} data={groups} pagination={false} />

          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            previousPage={previousPage}
            nextPage={nextPage}
            baseLink='/account/admin/group-manager'
          />
        </div>
      ) : (
        <Empty message='No group data available.' />
      )}
    </section>
  );
};

export default GroupManager;

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const params = extractParams(request);
  const { page, sort } = params;
  await queryClient.ensureQueryData({
    queryKey: ['fetchAllGroup', 'allGroups', page ?? 1, sort ?? '-createdAt'],
    queryFn: () =>
      getData({
        url: `/groups?page=${page || 1}&limit=12&sort=${sort || '-createdAt'}`,
      }),
  });

  return params;
};
