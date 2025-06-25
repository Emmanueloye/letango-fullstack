import DateRangeSelector from '../../components/UI/DateRangeSelector';
import { LoaderFunctionArgs, useParams } from 'react-router-dom';
import LinkBtn from '../../components/UI/LinkBtn';
import { useState } from 'react';
import { IIncomeAndExpense } from '../../dtos/groupDto';
import { fetchOnlyData, queryClient } from '../../helperFunc.ts/apiRequest';
import Empty from '../../components/UI/Empty';
import { formatDate, formatNumber } from '../../helperFunc.ts/utilsFunc';
import { useQuery } from '@tanstack/react-query';
import DownloadIncomeExpenseExcel from '../../components/Downloads/Excel/DownloadIncomeExpenseExcel';

const GroupStatement = () => {
  const params = useParams();
  const [report, setReport] = useState<IIncomeAndExpense[]>();
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
      url: `/group-reports/income-expense`,
      params: data,
    });

    if (result.status === 'success') {
      setReport(result?.incomeExpense);
      setIsLoading(false);
    }
    if (result.status === 'fail') {
      setError(result.message);
      setIsLoading(false);
    }
  };

  // Total income calculation
  const totalIncome =
    report?.reduce((acc, curr) => {
      if (curr?._id?.headType === 'income') {
        return acc + curr?.amount;
      }
      return acc;
    }, 0) || 0;

  // Total expenses calculation
  const totalExpenses =
    report?.reduce((acc, curr) => {
      if (curr?._id?.headType === 'expense') {
        return acc + curr?.amount;
      }
      return acc;
    }, 0) || 0;

  return (
    <>
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
          <div className='flex gap-2 flex-wrap'>
            <DownloadIncomeExpenseExcel
              group={data?.group}
              statement={report}
              dateRange={{ startDate, endDate }}
            />
          </div>
          <div className='mt-5'>
            <p className='capitalize font-500'>{data?.group?.groupName}</p>
            <p className='capitalize font-500'>Income & Expense Statement</p>
            <p className='capitalize font-500'>
              Start Date: {formatDate(new Date(startDate))}
            </p>
            <p className='capitalize font-500'>
              End Date: {formatDate(new Date(endDate))}
            </p>
          </div>
          <div className='grid mt-4'>
            {/* Income section */}
            {report?.filter((item) => item._id.headType === 'income').length >
              0 && (
              <div className='mb-3'>
                {/* Header */}
                <div className='flex justify-between border p-1'>
                  <h3 className='capitalize font-600'>Income</h3>
                  <h3 className='capitalize font-600'>&#8358; </h3>
                </div>
                {/* income details box */}
                <div className='border *:even:bg-gray-200 *:dark:even:bg-slate-600'>
                  {report?.map((item, index) => {
                    if (item._id.headType === 'income') {
                      return (
                        <div
                          key={index}
                          className='flex justify-between p-1 capitalize'
                        >
                          <span>{item?._id?.head}</span>
                          <span>{formatNumber(item.amount || 0)}</span>
                        </div>
                      );
                    }
                  })}

                  {/* Total income box */}
                  <div className=' border-t flex justify-between p-1 capitalize font-600'>
                    <span>total income</span>
                    <span>{formatNumber(totalIncome || 0)}</span>
                  </div>
                </div>
              </div>
            )}
            {/* Expenses section */}
            {report?.filter((item) => item._id.headType === 'expense').length >
              0 && (
              <div>
                <h3 className='border p-1 capitalize font-600'>expense</h3>
                {/* expenses details box */}
                <div className='border *:even:bg-gray-200 *:dark:even:bg-slate-600'>
                  {report?.map((item, index) => {
                    if (item?._id?.headType === 'expense') {
                      return (
                        <div
                          key={index}
                          className='flex justify-between p-1 capitalize'
                        >
                          <span>{item?._id?.head}</span>
                          <span>{formatNumber(item?.amount * -1 || 0)}</span>
                        </div>
                      );
                    }
                  })}

                  {/* total expenses box */}
                  <div className=' border-t flex justify-between p-1 capitalize font-600'>
                    <span>total expenses</span>
                    <span>{formatNumber(totalExpenses * -1 || 0)}</span>
                  </div>
                </div>
              </div>
            )}
            <div className='mt-2 border-t-2 border-b-2 flex justify-between p-1 capitalize font-600'>
              <span>Surplus/(Deficit)</span>
              <span>{formatNumber(totalIncome + totalExpenses)}</span>
            </div>
          </div>
        </>
      ) : (
        <Empty message='No transaction yet.' />
      )}
    </>
  );
};

export default GroupStatement;

// eslint-disable-next-line react-refresh/only-export-components
export const loader = async ({ params }: LoaderFunctionArgs) => {
  await queryClient.ensureQueryData({
    queryKey: ['fetchGroup', params.groupId],
    queryFn: () => fetchOnlyData({ url: `/groups/${params.groupId}` }),
  });
};
