import { useOutletContext, useSearchParams } from 'react-router-dom';
import DateRangeSelector from '../../components/UI/DateRangeSelector';
import LinkBtn from '../../components/UI/LinkBtn';
import TransactionBox from '../../components/UI/TransactionBox';
import { fetchOnlyData } from '../../helperFunc.ts/apiRequest';
import Empty from '../../components/UI/Empty';
import { PersonalStatment } from '../../dtos/statementDto';
import {
  formatDate,
  formatDateWD,
  formatNumber,
  formatTime,
  paginate,
} from '../../helperFunc.ts/utilsFunc';
import { User } from '../../dtos/UserDto';
import ReportPagination from '../../components/UI/ReportPagination';
import { useState } from 'react';
import DownloadStatment from '../../components/Downloads/Excel/DownloadStatment';
import DownloadStatementPDF from '../../components/Downloads/PDF/DownloadStatementPDF';

const WalletTransaction = () => {
  const [report, setReport] = useState<PersonalStatment>();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const user = useOutletContext() as User;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const params = Object.fromEntries(formData);

    setIsLoading(true);

    const result = await fetchOnlyData({
      url: `/personal/statement`,
      params,
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

  // Pagination setup
  const [searchParams] = useSearchParams();
  // Get start and end index
  const { startIndex, endIndex } = paginate(searchParams);

  const statements = report?.statement || [];
  const paginateStatements = statements?.slice(startIndex, endIndex);

  return (
    <section>
      <div className='flex justify-end mb-4'>
        <LinkBtn btnText='back' url='/account/personal-wallet' />
      </div>
      {/* Date selector */}
      <DateRangeSelector
        handleSubmit={handleSubmit}
        error={error}
        isLoading={isLoading}
      />
      {/* table */}

      {/* transaction cards */}
      <div className='block'>
        {report?.status === 'success' && statements?.length > 0 ? (
          <>
            <div className='flex gap-2 flex-wrap'>
              <DownloadStatment
                openingBal={report?.openingBal}
                closingBal={user?.personalWallet}
                customerDetails={user}
                dateRange={report?.date}
                statementContent={report?.statement}
              />
              <DownloadStatementPDF
                openingBal={report?.openingBal}
                closingBal={user?.personalWallet}
                customerDetails={user}
                dateRange={report?.date}
                statementContent={report?.statement}
              />
            </div>
            <h4 className='text-center mt-8 mb-3 font-600'>
              Transaction history
            </h4>
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
            <div className='flex justify-between mb-2 text-[13px] border-2 border-green-500 p-2 rounded-md font-600'>
              <p className='font-poppins capitalize'>opening Balance:</p>
              <p className='font-poppins capitalize'>
                {report?.openingBal ? formatNumber(report?.openingBal) : '0.00'}
              </p>
            </div>
            {paginateStatements?.map((item) => (
              <TransactionBox
                key={item._id}
                description={item.description}
                date={item.createdAt && formatDateWD(new Date(item.createdAt))}
                time={item.createdAt && formatTime(new Date(item.createdAt))}
                amount={item.contribution}
              />
            ))}
            {/* closing balance section */}
            <div className='flex justify-between mt-2 text-[13px] border-2 border-green-500 p-2 rounded-md font-600'>
              <p className='font-poppins capitalize'>closing Balance:</p>
              <p className='font-poppins capitalize'>
                {user?.personalWallet
                  ? formatNumber(user?.personalWallet)
                  : '0.00'}
              </p>
            </div>
            <ReportPagination numOfResults={report?.statement?.length} />
          </>
        ) : (
          <Empty message='No transaction history' />
        )}
      </div>
    </section>
  );
};

export default WalletTransaction;

// export const action = async ({ request }: ActionFunctionArgs) => {
//   const data = await extractFormData(request);
//   return postData({ url: `/personal/statement`, data });
// };
