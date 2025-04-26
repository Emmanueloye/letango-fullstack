import LinkBtn from '../../../components/UI/LinkBtn';
import Title from '../../../components/UI/Title';
import TransactionBox from '../../../components/UI/TransactionBox';

const ClosedWithdrawals = () => {
  return (
    <section>
      <div className='flex justify-end mb-2'>
        <LinkBtn btnText='back' url='/account/admin/withdrawals' />
      </div>
      <Title title='closed withdrawals' />
      <>
        {/* First */}
        <div className='relative'>
          <div className='absolute right-0'>
            <input type='checkbox' id='checkbox' defaultChecked />
          </div>
          <TransactionBox
            description='payment to Jan contributor'
            date='April 17, 2025'
            time='11:23am'
            amount={40_000}
          />
        </div>
        {/* Second */}
        <div className='relative'>
          <div className='absolute right-0'>
            <input type='checkbox' id='checkbox-2' defaultChecked />
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

export default ClosedWithdrawals;
