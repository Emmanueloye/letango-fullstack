import { Group } from '../../dtos/groupDto';
import { formatNumber } from '../../helperFunc.ts/utilsFunc';
import LinkBtn from '../UI/LinkBtn';

const GroupBalanceDisplay = ({
  group,
  withdrawalsPending,
}: {
  group: Group;
  withdrawalsPending: number;
}) => {
  return (
    <div className='bg-gray-100 dark:bg-slate-800 flex justify-between items-center flex-wrap mt-0.5 p-1.5 border-b-2 border-t-2 border-green-600 min-h-full'>
      <div>
        <div className='font-poppins text-sm'>
          <span className='font-500'>Account Balance: </span>
          <span className='font-600 text-green-600'>
            &#8358;{formatNumber(group?.groupBalance || 0)}
          </span>
        </div>
        <div className='font-poppins text-sm'>
          <span className='font-500'>Pending withdrawal: </span>
          <span className='font-600 text-green-600'>
            &#8358;{formatNumber(withdrawalsPending || 0)}
          </span>
        </div>
        <div className='font-poppins text-sm'>
          <span className='font-500'>Effective Balance: </span>
          <span className='font-600 text-green-600'>
            &#8358;
            {formatNumber(group?.groupBalance - withdrawalsPending || 0)}
          </span>
        </div>
      </div>

      <LinkBtn
        btnText='report'
        url={`/account/manage-group/view/${group?.groupRef}/reports`}
      />
    </div>
  );
};

export default GroupBalanceDisplay;
