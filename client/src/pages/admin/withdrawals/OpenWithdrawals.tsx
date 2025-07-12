/* eslint-disable react-refresh/only-export-components */
import { useQuery } from '@tanstack/react-query';
import LinkBtn from '../../../components/UI/LinkBtn';
import Title from '../../../components/UI/Title';
import {
  extractFormData,
  getData,
  patchData,
  queryClient,
} from '../../../helperFunc.ts/apiRequest';
import DataTableUI, { Row } from '../../../components/UI/DataTable';
import { formatNumber } from '../../../helperFunc.ts/utilsFunc';
import { ActionFunctionArgs, Link, useSubmit } from 'react-router-dom';
import { FaEye } from 'react-icons/fa';
import { useState } from 'react';

const OpenWithdrawals = () => {
  const submit = useSubmit();
  const { data } = useQuery({
    queryKey: ['fetchWithdrawal', 'withdrawals'],
    queryFn: () =>
      getData({ url: `/withdrawals/admin?approvalStatus=approve` }),
  });

  const [withdrawals, setWithdrawals] = useState(data?.withdrawals);

  const handleSelectChange = async (
    e: React.ChangeEvent<HTMLSelectElement>,
    id: string
  ) => {
    const formData = new FormData();
    formData.append('id', id);
    formData.append('approvalStatus', e.target.value);
    submit(formData, { method: 'PATCH' });
  };

  const columns = [
    { name: 'WITHDRAWAL ID', selector: (row: Row) => row._id, sortable: true },
    {
      name: 'AMOUNT',
      selector: (row: Row) => formatNumber(row.contribution as number),
      sortable: true,
    },
    {
      name: 'BANK',
      cell: (row: Row) => <div className='capitalize'>{row.bank}</div>,
      sortable: true,
    },
    {
      name: 'BANK',
      selector: (row: Row) => row.accountNumber,
      sortable: true,
    },
    {
      name: 'FROM',
      cell: (row: Row) => {
        const fromGroup = row.fromGroup;

        if (
          typeof fromGroup === 'object' &&
          fromGroup !== null &&
          'groupName' in fromGroup
        ) {
          return (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            <div className='capitalize'>{(fromGroup as any).groupName}</div>
          );
        }

        return <div className='capitalize'>N/A</div>;
      },
      sortable: true,
    },
    {
      name: 'TO',
      cell: (row: Row) => <div className='capitalize'>{row.to}</div>,
      sortable: true,
    },
    {
      name: 'ACTION',
      cell: (row: Row, index: number | undefined) => (
        <div className='flex item-center gap-2'>
          <Link
            to={`/account/admin/withdrawals/open/${row._id}`}
            className='bg-amber-600 px-2 py-0 rounded-full flex justify-center items-center text-slate-50'
          >
            <FaEye />
          </Link>
          <select
            id={`withdrawalActions-${index}`}
            name='approvalStatus'
            onChange={(e) => handleSelectChange(e, row._id as string)}
          >
            <option value='' hidden>
              Select Action
            </option>
            <option value='processing'>Processing</option>
            <option value='closed'>Closed</option>
          </select>
        </div>
      ),
    },
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      const searchData = data?.withdrawals?.filter(
        (item: { _id: string }) => item._id === e.target.value
      );

      setWithdrawals(searchData);
    } else {
      setWithdrawals(data?.withdrawals);
    }
  };

  return (
    <section>
      {/* Back link */}
      <div className='flex justify-end mb-2'>
        <LinkBtn btnText='back' url='/account/admin/withdrawals' />
      </div>
      {/* Title */}
      <Title title='open withdrawals' />
      <>
        <div className='md:w-3/5 w-full mx-auto'>
          <input
            type='text'
            className='mb-3 placeholder:text-sm'
            placeholder='Search withdrawal ID here...'
            onChange={handleSearchChange}
          />
        </div>
        <DataTableUI columns={columns} data={withdrawals} pagination={true} />
      </>
    </section>
  );
};

export default OpenWithdrawals;

export const loader = async () => {
  return queryClient.ensureQueryData({
    queryKey: ['fetchWithdrawal', 'withdrawals'],
    queryFn: () =>
      getData({ url: `/withdrawals/admin?approvalStatus=approve` }),
  });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { id, ...data } = await extractFormData(request);

  return patchData({
    url: `/withdrawals/admin/${id}`,
    data,
    invalidate: ['fetchWithdrawal'],
    setToast: true,
  });
};
