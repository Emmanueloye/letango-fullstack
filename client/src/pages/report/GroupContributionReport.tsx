/* eslint-disable no-unsafe-optional-chaining */
import { LoaderFunctionArgs, useParams } from 'react-router-dom';
import LinkBtn from '../../components/UI/LinkBtn';
import DateRangeSelector from '../../components/UI/DateRangeSelector';
import React, { useState } from 'react';
import { ContributionReport } from '../../dtos/groupDto';
import { fetchOnlyData, queryClient } from '../../helperFunc.ts/apiRequest';
import { formatDate, formatNumber } from '../../helperFunc.ts/utilsFunc';
import Empty from '../../components/UI/Empty';
import Title from '../../components/UI/Title';
import { useQuery } from '@tanstack/react-query';
import DownloadContributionExcel from '../../components/Downloads/Excel/DownloadContributionExcel';
import DataTableUI, { Row } from '../../components/UI/DataTable';

const GroupContributionReport = () => {
  const params = useParams();
  const [report, setReport] = useState<ContributionReport[]>();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const { data } = useQuery({
    queryKey: ['fetchGroup', params.groupId],
    queryFn: () => fetchOnlyData({ url: `/groups/${params.groupId}` }),
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const form = Object.fromEntries(formData);
    const data = { ...form, groupRef: params.groupId };

    setEndDate(`${form.endDate}`);
    setStartDate(`${form.startDate}`);
    setIsLoading(true);

    const result = await fetchOnlyData({
      url: `/group-reports/contributions`,
      params: data,
    });

    if (result.status === 'success') {
      // For total rows
      const totalRow = result?.contributions?.reduce(
        (
          acc: Record<string, number | string>,
          item: { [x: string]: string | number }
        ) => {
          for (const key in item) {
            if (typeof item[key] === 'number') {
              acc[key] = ((acc[key] || 0) as string) + item[key];
            } else {
              acc[key] = acc[key] || (key === 'memberName' ? 'Total' : '');
            }
          }
          return acc;
        },
        {}
      );

      const updatedResults = [...result?.contributions, totalRow];

      setReport(updatedResults);
      setIsLoading(false);
    }
    if (result.status === 'fail') {
      setError(result.message);
      setIsLoading(false);
    }
  };

  // type Row = {
  //   [key: string]: number | string;
  // };

  const tableHeaders = report && Object?.keys(report?.[0] as object);
  const columns = tableHeaders?.map((item) => {
    return {
      name: item.toUpperCase(),
      cell: (row: Row) => (
        <div style={{ textTransform: 'capitalize' }}>
          {typeof row[item] === 'string'
            ? row[item]
            : typeof row[item] === 'number'
            ? formatNumber(row[item])
            : row[item]?.toString?.()}
        </div>
      ),
      sortable: true,
    };
  });

  return (
    <>
      <Title title='Members Contribution Report' />
      <div className='flex justify-end mb-4'>
        <LinkBtn
          btnText='back'
          url={`/account/manage-group/view/${params.groupId}/reports`}
        />
      </div>

      <DateRangeSelector
        handleSubmit={handleSubmit}
        error={error}
        isLoading={isLoading}
      />
      {report && report?.length > 0 ? (
        <>
          <DownloadContributionExcel
            group={data?.group}
            headers={tableHeaders as string[]}
            statement={report}
            dateRange={{ startDate, endDate }}
          />
          <div
            className='aside'
            style={{ width: '100%', overflowX: 'auto', marginTop: '20px' }}
          >
            <div className='text-center capitalize mb-3 font-500'>
              <p>Members contribution List</p>
              <p>start Date: {startDate && formatDate(new Date(startDate))}</p>
              <p>end Date: {endDate && formatDate(new Date(endDate))}</p>
            </div>
            <DataTableUI columns={columns ?? []} data={report || []} />
          </div>
        </>
      ) : (
        <Empty message='No record available.' />
      )}
    </>
  );
};

export default GroupContributionReport;

// eslint-disable-next-line react-refresh/only-export-components
export const loader = async ({ params }: LoaderFunctionArgs) => {
  await queryClient.ensureQueryData({
    queryKey: ['fetchGroup', params.groupId],
    queryFn: () => fetchOnlyData({ url: `/groups/${params.groupId}` }),
  });
};
