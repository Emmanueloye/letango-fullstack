import { formatNumber } from '../../helperFunc.ts/utilsFunc';

const TransactionBox = ({
  description,
  date,
  time,
  amount,
  show = false,
}: {
  description: string;
  date: string;
  time: string;
  amount: number;
  show?: boolean;
}) => {
  const amtColor = amount > 0 ? 'text-green-600' : 'text-amber-600';

  return (
    <article className=' bg-gray-100 dark:bg-slate-800 py-2 px-4 mt-1 font-poppins rounded-2xl shadow'>
      <div className='flex justify-between items-center flex-wrap '>
        <div>
          <h4 className='font-600 capitalize text-sm mb-2 font-ral'>
            {description}
          </h4>
          <p className='text-xs  text-gray-500 dark:text-gray-400'>{date}</p>
          <p className='text-xs  text-gray-500 dark:text-gray-400'>{time}</p>
        </div>
        <p className={`text-sm font-500 break-words ${amtColor}`}>
          &#8358;{formatNumber(amount)}
        </p>
      </div>
      {/* withdrawal approval tracker */}
      {show && (
        <div className='border-t-1 text-sm'>
          <span className='capitalize'>approvals: </span>
          <div className='text-sm font-500 flex gap-3 flex-wrap'>
            <span title='Osunkoya Mayowa'>Osunkoya M ✔✔</span>
            <span title='Oyediran Emmanuel'>Oyediran E ✔✔</span>
            <span title='Lamidi Adekola'>Lamidi A ...</span>
          </div>
        </div>
      )}
    </article>
  );
};

export default TransactionBox;
