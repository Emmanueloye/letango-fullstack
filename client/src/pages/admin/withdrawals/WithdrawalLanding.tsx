import { FaBoxOpen, FaLock } from 'react-icons/fa';
import Card from '../../../components/UI/Card';
import { Link } from 'react-router-dom';
import Chart from '../../../components/DashboardComponents/Chart';

// Temp data
const withdrawalData = [
  { name: 'Jan', amount: 20000 },
  { name: 'Feb', amount: 20000 },
  { name: 'Mar', amount: 20000 },
];

const WithdrawalLanding = () => {
  return (
    <>
      <div className='grid md:grid-cols-3 gap-4'>
        <Link to='/account/admin/withdrawals/open'>
          <Card
            cardDesc='open withdrawals'
            balance={30_000}
            icon={<FaBoxOpen />}
          />
        </Link>
        <Link to='/account/admin/withdrawals/closed'>
          <Card
            cardDesc='closed withdrawals'
            balance={30_000}
            icon={<FaLock />}
          />
        </Link>
        <Link to='/account/admin/withdrawals/pending'>
          <Card
            cardDesc='awaiting approval'
            balance={30_000}
            icon={<FaLock />}
          />
        </Link>
      </div>
      <Chart
        data={withdrawalData}
        xAxisName='name'
        dataKeys={['amount']}
        barColors={['#00b6d4']}
      />
    </>
  );
};

export default WithdrawalLanding;
