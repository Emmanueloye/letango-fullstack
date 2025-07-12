/* eslint-disable react-refresh/only-export-components */
import { FaBoxOpen, FaLock } from 'react-icons/fa';
import { MdPending } from 'react-icons/md';
import { FcCancel } from 'react-icons/fc';
import Card from '../../../components/UI/Card';
import { Link, redirect } from 'react-router-dom';
import Chart from '../../../components/DashboardComponents/Chart';
import { fetchOnlyData, queryClient } from '../../../helperFunc.ts/apiRequest';

// Temp data
const withdrawalData = [
  { name: 'Jan', amount: 20000 },
  { name: 'Feb', amount: 20000 },
  { name: 'Mar', amount: 20000 },
];

const WithdrawalLanding = () => {
  return (
    <>
      <div className='grid md:grid-cols-4 gap-4'>
        <Link to='/account/admin/withdrawals/open'>
          <Card cardDesc='open withdrawals' icon={<FaBoxOpen />} />
        </Link>
        <Link to='/account/admin/withdrawals/closed'>
          <Card cardDesc='closed withdrawals' icon={<FaLock />} />
        </Link>
        <Link to='/account/admin/withdrawals/pending'>
          <Card cardDesc='awaiting approval' icon={<MdPending />} />
        </Link>
        <Link to='/account/admin/withdrawals/pending'>
          <Card cardDesc='rejected withdrawals' icon={<FcCancel />} />
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

export const loader = async () => {
  const resp = await queryClient.ensureQueryData({
    queryKey: ['user'],
    queryFn: () => fetchOnlyData({ url: '/users/me' }),
  });

  const roles = ['super-admin', 'admin'];

  if (resp?.user && !roles.includes(resp?.user?.role)) {
    return redirect('/login');
  }
};
