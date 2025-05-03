/* eslint-disable react-refresh/only-export-components */
import {
  ActionFunctionArgs,
  useActionData,
  useOutletContext,
} from 'react-router-dom';
import DateRangeSelector from '../../components/UI/DateRangeSelector';
import LinkBtn from '../../components/UI/LinkBtn';
import TransactionBox from '../../components/UI/TransactionBox';
import { extractFormData, postData } from '../../helperFunc.ts/apiRequest';
import Empty from '../../components/UI/Empty';
import { PersonalStatment } from '../../dtos/statementDto';
import {
  formatDate,
  formatDateWD,
  formatNumber,
  formatTime,
} from '../../helperFunc.ts/utilsFunc';
import { User } from '../../dtos/UserDto';

const WalletTransaction = () => {
  const data = useActionData() as PersonalStatment;
  const user = useOutletContext() as User;

  return (
    <section>
      <div className='flex justify-end mb-4'>
        <LinkBtn btnText='back' url='/account/personal-wallet' />
      </div>
      {/* Date selector */}
      <DateRangeSelector />
      {/* table */}

      {/* transaction cards */}
      <div className='block'>
        {data?.status === 'success' && data?.noHits > 0 ? (
          <>
            <h4 className='text-center mt-8 mb-3 font-600'>
              Transaction history
            </h4>
            {/* Report date range */}
            <div className='mb-2 text-[13px] border-2 border-green-500 p-2 rounded-md'>
              <p className='font-poppins capitalize mb-2'>
                start Date: {formatDate(new Date(data?.date?.startDate))}
              </p>
              <p className='font-poppins capitalize'>
                end Date: {formatDate(new Date(data?.date?.endDate))}
              </p>
            </div>
            {/* Opening balance section */}
            <div className='flex justify-between mb-2 text-[13px] border-2 border-green-500 p-2 rounded-md font-600'>
              <p className='font-poppins capitalize'>opening Balance:</p>
              <p className='font-poppins capitalize'>
                {data?.openingBal ? formatNumber(data?.openingBal) : '0.00'}
              </p>
            </div>
            {data?.statement?.map((item) => (
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
          </>
        ) : (
          <Empty message='No transaction history' />
        )}
      </div>
    </section>
  );
};

export default WalletTransaction;

export const action = async ({ request }: ActionFunctionArgs) => {
  const data = await extractFormData(request);
  return postData({ url: `/personal/statement`, data });
};
