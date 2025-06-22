import { useEffect, useRef, useState } from 'react';
import { Approval, Withdrawal } from '../../dtos/paymentDto';
import { formatNumber } from '../../helperFunc.ts/utilsFunc';
import WithdrawalOverlay from '../DashboardComponents/WithdrawalOverlay';
import WithdrawalDisplay from '../DashboardComponents/WithdrawalDisplay';
import WithdrawalDetailsOverlay from '../DashboardComponents/WithdrawalDetailsOverlay';

const TransactionBox = ({
  description,
  transaction,
  date,
  time,
  amount,
  approvals,
  from,
  id,
  show = false,
}: {
  transaction?: Withdrawal;
  description: string;
  date: string;
  time: string;
  amount: number;
  from?: string;
  approvals?: Approval[];
  id?: string;
  show?: boolean;
}) => {
  const [action, setAction] = useState(false);
  const [details, setDetails] = useState(false);
  const [height, setHeight] = useState<number>();
  const boxRef = useRef<HTMLElement>(null);
  const amtColor = amount > 0 ? 'text-green-600' : 'text-amber-600';

  useEffect(() => {
    if (boxRef.current) {
      const height = boxRef.current.getBoundingClientRect().height;
      setHeight(height);
    }
  }, [height]);

  return (
    <article
      ref={boxRef}
      className=' bg-gray-100 dark:bg-slate-800 py-4 px-4 mt-2 font-poppins rounded-2xl shadow relative overflow-x-hidden overflow-y aside'
    >
      <div className='flex justify-between items-center flex-wrap '>
        <div>
          <h4 className='font-600 capitalize text-sm mb-2 font-ral'>
            {description}
          </h4>
          <p className='capitalize text-xs mb-1'>
            {amount > 0 ? 'payment from' : 'transfer to'}: {from}
          </p>

          <p className='text-xs  text-gray-500 dark:text-gray-400 mb-1'>
            {date}
          </p>
          <p className='text-xs  text-gray-500 dark:text-gray-400 mb-1'>
            {time}
          </p>
        </div>
        <p className={`text-sm font-500 break-words ${amtColor}`}>
          &#8358;{formatNumber(amount)}
        </p>
      </div>

      {/* withdrawal approval tracker */}
      {show && (
        <>
          <WithdrawalDisplay
            approvals={approvals as Approval[]}
            setAction={setAction}
            setDetails={setDetails}
            transaction={transaction}
          />
        </>
      )}

      {/* Form overlay */}
      <WithdrawalOverlay
        action={action}
        id={id as string}
        height={height as number}
        setAction={setAction}
      />
      {/* Details overlay */}
      <WithdrawalDetailsOverlay
        withdrawal={transaction as Withdrawal}
        details={details}
        height={height as number}
        setDetails={setDetails}
      />
    </article>
  );
};

export default TransactionBox;
