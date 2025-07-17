/* eslint-disable react-refresh/only-export-components */
// import DateRangeSelector from '../../components/UI/DateRangeSelector';
import { useState } from 'react';
import DateRangeSelector from '../../components/UI/DateRangeSelector';
import Empty from '../../components/UI/Empty';
import LinkBtn from '../../components/UI/LinkBtn';
import ReportPagination from '../../components/UI/ReportPagination';
import Title from '../../components/UI/Title';
import TransactionBox from '../../components/UI/TransactionBox';
import {
  formatDate,
  formatDateWD,
  formatNumber,
  formatTime,
  paginate,
} from '../../helperFunc.ts/utilsFunc';
import { useSearchParams } from 'react-router-dom';
import { IGroupTransaction } from '../../dtos/paymentDto';
import {
  fetchOnlyData,
  getData,
  queryClient,
} from '../../helperFunc.ts/apiRequest';
import { useQuery } from '@tanstack/react-query';
import { Group } from '../../dtos/groupDto';
import DownloadStatementPDF from '../../components/Downloads/PDF/DownloadStatementPDF';
import DownloadStatment from '../../components/Downloads/Excel/DownloadStatment';

const StatementGroup = () => {
  const [report, setReport] = useState<IGroupTransaction>();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [group, setGroup] = useState<Group>();

  const [searchParams] = useSearchParams();

  const { startIndex, endIndex } = paginate(searchParams);

  const statements = report?.statement || [];
  const paginateStatements = statements?.slice(startIndex, endIndex);

  const { data } = useQuery({
    queryKey: ['fetchAllGroup', 'allGroups'],
    queryFn: () => getData({ url: `/groups` }),
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const form = Object.fromEntries(formData);
    const newForm = { ...form };

    setIsLoading(true);
    const group = data?.groups?.find(
      (item: { groupRef: FormDataEntryValue }) =>
        item?.groupRef === newForm.groupRef
    );

    setGroup(group);

    const result = await fetchOnlyData({
      url: `/group-reports/statement/admin`,
      params: form,
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
    <section>
      <Title title='Group Statement' />
      <div className='flex justify-end mb-4'>
        <LinkBtn btnText='back' url='/account/admin/statement' />
      </div>
      <DateRangeSelector
        handleSubmit={handleSubmit}
        error={error}
        isLoading={isLoading}
        showCustomer
        customers={data?.groups}
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
                group={group}
              />
              <DownloadStatment
                openingBal={report?.openingBal}
                closingBal={closingBal as number}
                group={group}
                statementContent={report?.statement}
                dateRange={report?.date}
              />
            </div>
            <h4 className='text-center mt-8 font-600'>Transaction history</h4>
            {/* Report date range */}
            <div className='mb-2 text-[13px] border-2 border-green-500 p-2 rounded-md'>
              <p className='font-poppins uppercase mb-2'>
                {group?.groupName} statement
              </p>
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
    </section>
  );
};

export default StatementGroup;

export const loader = async () => {
  await queryClient.ensureQueryData({
    queryKey: ['fetchAllGroup', 'allGroups'],
    queryFn: () => getData({ url: `/groups` }),
  });
};
