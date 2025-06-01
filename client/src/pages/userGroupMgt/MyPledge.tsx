import { Link, useParams } from 'react-router-dom';
import LinkBtn from '../../components/UI/LinkBtn';
import Button from '../../components/UI/Button';

const MyPledge = () => {
  const params = useParams();
  return (
    <section>
      {/* back button */}
      <div className='flex justify-end mb-3'>
        <LinkBtn
          btnText='Back'
          url={`/account/manage-group/view/${params?.groupId}`}
        />
      </div>
      {/* create new pledge link */}
      <Link
        to={`/account/manage-group/view/${params.groupId}/my-pledge/create`}
        className='bg-primary-500 text-slate-50 px-3 py-2 rounded-md capitalize font-600 mt-1 mb-4'
      >
        new
      </Link>

      {/* My pledge listing */}

      <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-3 mt-6'>
        <div className='flex justify-between flex-wrap items-start shadow px-2 py-3 dark:bg-slate-800 bg-gray-100'>
          <div className='mb-2'>
            <p className='mb-2 font-500 capitalize text-[13px]'>
              pledger: Osunkoya mayowa
            </p>
            <p className='mb-2 font-500  capitalize text-[13px]'>
              <span>pledge amount: </span>
              <span className='font-poppins font-400'>102,000</span>
            </p>
            <p className='capitalize text-[12px]'>pledge date: date</p>
            <p className='capitalize text-[12px]'>redeem date: date</p>
            <Button btnText='redeem' btnType='button' />
          </div>
        </div>
      </div>
    </section>
  );
};

export default MyPledge;
