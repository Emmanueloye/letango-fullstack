import { FaTimesCircle } from 'react-icons/fa';
import { Withdrawal } from '../../dtos/paymentDto';
import { formatNumber } from '../../helperFunc.ts/utilsFunc';

const WithdrawalDetailsOverlay = ({
  withdrawal,
  details,
  height,
  setDetails,
}: {
  withdrawal: Withdrawal;
  details: boolean;
  setDetails: (action: boolean) => void;
  height: number;
}) => {
  return (
    <div
      style={{ height: `${height + 50}px` }}
      className={`absolute top-0 ${
        details ? 'left-0' : '-left-[100%]'
      } w-full bg-slate-100 dark:bg-slate-600 rounded-md transition-all duration-700 ease-in-out p-2 font-ral px-4`}
    >
      <div className='flex justify-end'>
        <FaTimesCircle
          title='Close'
          className='text-2xl cursor-pointer'
          onClick={() => setDetails(false)}
        />
      </div>

      <div className='border-b-1 border-gray-400 py-1'>
        <span>Requested By: </span>
        <span className='capitalize'>
          {withdrawal?.requester.surname} {withdrawal?.requester.otherNames}
        </span>
      </div>
      <div className='border-b-1 border-gray-400 py-1'>
        <span>Receiver: </span>
        <span className='capitalize'>{withdrawal?.to}</span>
      </div>
      <div className='border-b-1 border-gray-400 py-1'>
        <span>Receiver account: </span>
        <span className='capitalize font-poppins font-300'>
          {withdrawal?.accountNumber}
        </span>
      </div>
      <div className='border-b-1 border-gray-400 py-1'>
        <span>Amount: </span>
        <span className='capitalize font-poppins font-300'>
          &#8358;{formatNumber(withdrawal?.contribution)}
        </span>
      </div>
      <div className='pb-2'>
        <span>Description: </span>
        <span className='capitalize'>{withdrawal?.description}</span>
      </div>
    </div>
  );
};

export default WithdrawalDetailsOverlay;
