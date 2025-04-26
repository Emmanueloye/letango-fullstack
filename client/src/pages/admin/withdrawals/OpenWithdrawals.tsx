import LinkBtn from '../../../components/UI/LinkBtn';
import Title from '../../../components/UI/Title';
import TransactionBox from '../../../components/UI/TransactionBox';

const OpenWithdrawals = () => {
  return (
    <section>
      {/* Back link */}
      <div className='flex justify-end mb-2'>
        <LinkBtn btnText='back' url='/account/admin/withdrawals' />
      </div>
      {/* Title */}
      <Title title='open withdrawals' />
      <>
        {/* first */}
        <div className='relative'>
          <div className='absolute right-0'>
            <input type='checkbox' id='checkbox' />
          </div>
          <TransactionBox
            description='payment to Jan contributor'
            date='April 17, 2025'
            time='11:23am'
            amount={40_000}
          />
        </div>
        {/* second */}
        <div className='relative'>
          <div className='absolute right-0'>
            <input type='checkbox' id='checkbox-2' />
          </div>
          <TransactionBox
            description='payment to Jan contributor'
            date='April 17, 2025'
            time='11:23am'
            amount={40_000}
          />
        </div>
      </>
    </section>
  );
};

export default OpenWithdrawals;
