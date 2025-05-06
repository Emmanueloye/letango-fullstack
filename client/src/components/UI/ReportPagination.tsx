import { useSearchParams } from 'react-router-dom';
import { PAGE_SIZE } from '../../Actions/constant';

const ReportPagination = ({ numOfResults }: { numOfResults: number }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  //   Get current page
  const currentPage = !searchParams.get('page')
    ? 1
    : Number(searchParams.get('page'));

  // Calculate pagecount
  const pageCount = Math.ceil(numOfResults / PAGE_SIZE);

  //   next page
  const nextPage = () => {
    const next = currentPage === pageCount ? currentPage : currentPage + 1;
    searchParams.set('page', `${next}`);
    setSearchParams(searchParams);
  };

  const prevPage = () => {
    const prev = currentPage === 1 ? currentPage : currentPage - 1;
    searchParams.set('page', `${prev}`);
    setSearchParams(searchParams);
  };

  if (numOfResults <= PAGE_SIZE) return null;

  return (
    <div className='flex justify-between font-poppins text-sm mt-2 border-t-1 border-amber-500 pt-3'>
      <p>
        Showing <span>{(currentPage - 1) * PAGE_SIZE + 1}</span> to
        <span>
          {' '}
          &nbsp;
          {currentPage === pageCount ? numOfResults : currentPage * PAGE_SIZE}
        </span>
        &nbsp; of
        <span> {numOfResults}</span>
      </p>
      <div className='flex flex-wrap gap-2'>
        <button
          className='bg-slate-400 px-3 py-1 rounded-md capitalize text-slate-50 cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-300'
          onClick={prevPage}
          disabled={currentPage === 1}
        >
          prev
        </button>
        <button
          className='bg-slate-400 px-3 py-1 rounded-md capitalize text-slate-50 cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-300'
          onClick={nextPage}
          disabled={currentPage === pageCount}
        >
          next
        </button>
      </div>
    </div>
  );
};

export default ReportPagination;
