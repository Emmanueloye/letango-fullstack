import { FaPencilAlt } from 'react-icons/fa';
import { formatNumber } from '../../helperFunc.ts/utilsFunc';
import { Link } from 'react-router-dom';

const GroupCard = ({
  cardDesc,
  balance,
  detailURLText,
  detailURL,
  editURL,
  icon,
}: {
  cardDesc: string;
  balance?: number;
  detailURLText: string;
  detailURL: string;
  editURL: string;
  icon: React.ReactElement;
}) => {
  return (
    <div className='bg-gray-100 dark:bg-slate-800 px-2 py-4 rounded-2xl shadow-lg shadow-black/25'>
      {/* card header */}
      <div className='flex justify-center gap-3'>
        <p className='text-center font-500 capitalize'>{cardDesc}</p>
        <Link to={editURL} className='text-amber-600'>
          <FaPencilAlt title='Edit' />
        </Link>
      </div>
      {/* Card balance */}
      <div className='flex justify-center '>
        <p className='text-center text-sm font-poppins mt-3'>
          &#8358;{`${formatNumber(balance || 0)}`}
        </p>
      </div>
      {/* View details link */}
      <div className='flex justify-center mt-3 text-sm underline'>
        <Link to={detailURL} className='capitalize text-center'>
          {detailURLText}
        </Link>
      </div>
      {/* card icon */}
      <div className='flex justify-center mt-4 text-2xl text-green-600'>
        {icon}
      </div>
    </div>
  );
};

export default GroupCard;
