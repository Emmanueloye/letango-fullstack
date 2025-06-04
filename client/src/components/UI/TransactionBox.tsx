import { Approval } from '../../dtos/paymentDto';
import { formatNumber } from '../../helperFunc.ts/utilsFunc';

const TransactionBox = ({
  description,
  date,
  time,
  amount,
  approvals,
  show = false,
}: {
  description: string;
  date: string;
  time: string;
  amount: number;
  approvals?: Approval[];
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
        <div className='border-t-1 text-sm pt-2'>
          <span className='capitalize'>approvals: </span>
          <div className='text-sm font-500 flex gap-3 flex-wrap'>
            {approvals?.map((item, index) => {
              let approvalStatus;
              if (item?.status === 'pending') {
                approvalStatus = <span className='text-amber-600'>...</span>;
              }

              if (item?.status === 'approve') {
                approvalStatus = <span className='text-green-600'>✔</span>;
              }

              if (item?.status === 'reject') {
                approvalStatus = (
                  <span className='text-green-600 text-sm'>❌</span>
                );
              }

              return (
                <span
                  key={index}
                  className='capitalize'
                  title={`${item?.userId?.surname.toUpperCase()} ${item?.userId?.otherNames.toUpperCase()}`}
                >
                  {item?.userId?.surname}{' '}
                  {item?.userId?.otherNames.split(' ')[0].charAt(0)}{' '}
                  {approvalStatus}
                </span>
              );
            })}

            {/* <span title='Oyediran Emmanuel'>Oyediran E ✔✔</span>
            <span title='Lamidi Adekola'>Lamidi A ...</span> */}
          </div>
        </div>
      )}
    </article>
  );
};

export default TransactionBox;
