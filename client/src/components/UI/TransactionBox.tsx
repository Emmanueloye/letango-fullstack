import { useState } from 'react';
import { Approval } from '../../dtos/paymentDto';
import { formatNumber } from '../../helperFunc.ts/utilsFunc';
import Button from './Button';
import { FaTimesCircle } from 'react-icons/fa';

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
  const [action, setAction] = useState(false);
  const amtColor = amount > 0 ? 'text-green-600' : 'text-amber-600';

  return (
    <article className=' bg-gray-100 dark:bg-slate-800 py-2 px-4 mt-2 font-poppins rounded-2xl shadow relative overflow-hidden'>
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

      <div
        className={`absolute top-0 ${
          action ? 'left-0' : '-left-[100%]'
        } w-full bg-slate-100 dark:bg-slate-600 rounded-md transition-all duration-700 ease-in-out p-2`}
      >
        <div className='w-full md:w-3/5 mx-auto mb-2 mt-1.5'>
          <select name='status' id='status' className='capitalize mb-2 py-1'>
            <option value='' hidden>
              Select action
            </option>
            <option value='approve'>approve</option>
            <option value='reject'>reject</option>
          </select>
          <textarea
            name='comment'
            id='comment'
            className='resize-none dark:bg-slate-700 mb-1 py-1'
            cols={1}
            rows={1}
            placeholder='Comment'
          ></textarea>
          <div className='flex gap-3 '>
            <Button btnText='save' btnType='submit' />
            <Button btnText='cancel' btnType='button' />
          </div>
        </div>
      </div>

      {/* withdrawal approval tracker */}
      {show && (
        <div className='flex justify-between items-center gap-3 flex-wrap border-t-1 text-sm pt-2 '>
          {/* approval label box */}
          <div>
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
                    title={`${item?.userId?.surname?.toUpperCase()} ${item?.userId?.otherNames?.toUpperCase()}`}
                  >
                    {item?.userId?.surname}{' '}
                    {item?.userId?.otherNames?.split(' ')[0].charAt(0)}
                    {approvalStatus}
                  </span>
                );
              })}

              {/* <span title='Oyediran Emmanuel'>Oyediran E ✔✔</span>
            <span title='Lamidi Adekola'>Lamidi A ...</span> */}
            </div>
          </div>
          {/*approval box  */}
          {approvals && (
            <span
              onClick={() => setAction(true)}
              className='capitalize text-[13px] text-slate-50 cursor-pointer bg-amber-600 py-1 px-5 rounded-full font-600'
            >
              action
            </span>
          )}
        </div>
      )}
    </article>
  );
};

export default TransactionBox;
