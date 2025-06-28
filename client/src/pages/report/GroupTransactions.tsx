import LinkBtn from '../../components/UI/LinkBtn';
import TransactionBox from '../../components/UI/TransactionBox';
import DateRangeSelector from '../../components/UI/DateRangeSelector';
import {
  LoaderFunctionArgs,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import { fetchOnlyData, queryClient } from '../../helperFunc.ts/apiRequest';
import { useState } from 'react';
import { IGroupTransaction } from '../../dtos/paymentDto';
import Empty from '../../components/UI/Empty';
import {
  formatDate,
  formatDateWD,
  formatNumber,
  formatTime,
  paginate,
} from '../../helperFunc.ts/utilsFunc';
import ReportPagination from '../../components/UI/ReportPagination';
import DownloadStatementPDF from '../../components/Downloads/PDF/DownloadStatementPDF';
import { useQuery } from '@tanstack/react-query';
import DownloadStatment from '../../components/Downloads/Excel/DownloadStatment';
import Title from '../../components/UI/Title';

const GroupTransactions = () => {
  const params = useParams();
  const [report, setReport] = useState<IGroupTransaction>();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [searchParams] = useSearchParams();

  const { startIndex, endIndex } = paginate(searchParams);

  const statements = report?.statement || [];
  const paginateStatements = statements?.slice(startIndex, endIndex);

  const { data: groupData } = useQuery({
    queryKey: ['fetchGroup', params.groupId],
    queryFn: () => fetchOnlyData({ url: `/groups/${params.groupId}` }),
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const form = Object.fromEntries(formData);
    const data = { ...form, groupRef: params.groupId };

    setIsLoading(true);

    const result = await fetchOnlyData({
      url: `/group-reports/statement`,
      params: data,
    });

    if (result.status === 'success') {
      setReport(result);
      setIsLoading(false);
    }
    if (result.status === 'fail') {
      setError(result.message);
      setIsLoading(false);
    }
  };

  const closingBal =
    report &&
    report?.openingBal +
      report?.statement.reduce((acc, curr) => acc + curr.contribution, 0);

  return (
    <>
      <Title title='Group Statement' />
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

      {/* Transaction cards */}
      <div className='block'>
        {report?.status === 'success' && report.statement ? (
          <>
            <div className='flex gap-2 flex-wrap'>
              <DownloadStatementPDF
                openingBal={report?.openingBal}
                closingBal={closingBal as number}
                statementContent={report?.statement}
                dateRange={report?.date}
                group={groupData.group}
              />
              <DownloadStatment
                openingBal={report?.openingBal}
                closingBal={closingBal as number}
                group={groupData?.group}
                statementContent={report?.statement}
                dateRange={report?.date}
              />
            </div>
            <h4 className='text-center mt-8 font-600'>Transaction history</h4>
            {/* Report date range */}
            <div className='mb-2 text-[13px] border-2 border-green-500 p-2 rounded-md'>
              <p className='font-poppins capitalize mb-2'>
                start Date: {formatDate(new Date(report?.date?.startDate))}
              </p>
              <p className='font-poppins capitalize'>
                end Date: {formatDate(new Date(report?.date?.endDate))}
              </p>
            </div>
            {/* Opening balance section */}
            <div className=' mb-2 text-[13px] border-2 border-green-500 p-2 rounded-md font-600'>
              <div className='flex justify-between'>
                <p className='font-poppins capitalize'>opening Balance:</p>
                <p className='font-poppins capitalize'>
                  {report?.openingBal
                    ? formatNumber(report?.openingBal)
                    : '0.00'}
                </p>
              </div>
              <div className='flex justify-between mt-1.5'>
                <p className='font-poppins capitalize'>closing Balance:</p>
                <p className='font-poppins capitalize'>
                  {formatNumber(closingBal || 0)}
                </p>
              </div>
            </div>

            {paginateStatements?.map((item) => {
              return (
                <TransactionBox
                  key={item._id}
                  description={item.description}
                  date={
                    item?.createdAt && formatDateWD(new Date(item?.createdAt))
                  }
                  time={
                    item?.createdAt && formatTime(new Date(item?.createdAt))
                  }
                  amount={item?.contribution}
                  from={
                    item?.contribution > 0
                      ? `${item?.fromId?.surname} ${
                          item?.fromId?.otherNames?.split(' ')[0]
                        }`
                      : `${item?.to}`
                  }
                />
              );
            })}
            {/* closing balance section */}
            <div className='flex justify-between mt-2 text-[13px] border-2 border-green-500 p-2 rounded-md font-600'>
              <p className='font-poppins capitalize'>closing Balance:</p>
              <p className='font-poppins capitalize'>
                {formatNumber(closingBal || 0)}
              </p>
            </div>
            <ReportPagination numOfResults={report?.statement?.length} />
          </>
        ) : (
          <Empty message='No group transaction' />
        )}
      </div>
    </>
  );
};

export default GroupTransactions;

// eslint-disable-next-line react-refresh/only-export-components
export const loader = async ({ params }: LoaderFunctionArgs) => {
  await queryClient.ensureQueryData({
    queryKey: ['fetchGroup', params.groupId],
    queryFn: () => fetchOnlyData({ url: `/groups/${params.groupId}` }),
  });
};
