import LinkBtn from '../../components/UI/LinkBtn';

const TransactionDetails = () => {
  return (
    <section>
      <article className='w-full lg:w-2/5 dark:bg-slate-800 bg-gray-100 p-2 mx-auto shadow'>
        <div className='text-center mb-4'>
          <p className='capitalize'>Transaction Details</p>
          {/* <p>reference</p> */}
        </div>
        <div className='flex justify-between mb-3 flex-wrap'>
          <p className='capitalize'>reference :</p>
          <p className='font-poppins'>test bank</p>
        </div>
        <div className='flex justify-between mb-3 flex-wrap'>
          <p className='capitalize'>contribution :</p>
          <p className='font-poppins'>&#8358;{20_000}</p>
        </div>
        <div className='flex justify-between mb-3 flex-wrap'>
          <p className='capitalize'>date :</p>
          <p className='font-poppins'>April 3, 2025</p>
        </div>
        <div className='flex justify-between mb-3 flex-wrap'>
          <p className='capitalize'>time :</p>
          <p className='font-poppins'>April 3, 2025</p>
        </div>
        <div className='flex justify-between mb-3 flex-wrap'>
          <p className='capitalize'>from :</p>
          <p className='font-poppins'>test bank</p>
        </div>
        <LinkBtn
          btnText='Back'
          url='/account/personal-wallet/transactions'
          className='flex justify-center'
        />
      </article>
    </section>
  );
};

export default TransactionDetails;
