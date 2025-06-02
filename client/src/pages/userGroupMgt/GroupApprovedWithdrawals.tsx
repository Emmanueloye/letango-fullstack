import { useParams } from 'react-router-dom';
import LinkBtn from '../../components/UI/LinkBtn';
import Title from '../../components/UI/Title';
import TransactionBox from '../../components/UI/TransactionBox';

const GroupApprovedWithdrawals = () => {
  const params = useParams();

  return (
    <section>
      <div className='flex justify-end mb-3'>
        <LinkBtn
          btnText='Back'
          url={`/account/manage-group/view/${params?.groupId}/withdraw`}
        />
      </div>
      <Title title='approved withdrawals' />

      <TransactionBox
        description='payment to Jan contributor'
        date='April 17, 2025'
        time='11:23am'
        amount={-40_000}
        show
      />
      <TransactionBox
        description='payment to Jan contributor'
        date='April 17, 2025'
        time='11:23am'
        amount={-40_000}
        show
      />
    </section>
  );
};

export default GroupApprovedWithdrawals;
