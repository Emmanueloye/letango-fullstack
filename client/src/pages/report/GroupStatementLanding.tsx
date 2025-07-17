/* eslint-disable react-refresh/only-export-components */
import { Link, redirect } from 'react-router-dom';
import Card from '../../components/UI/Card';
import { FaUser } from 'react-icons/fa';
import { FaPeopleGroup } from 'react-icons/fa6';
import { fetchOnlyData, queryClient } from '../../helperFunc.ts/apiRequest';

const GroupStatementLanding = () => {
  return (
    <section>
      <div className='grid md:grid-cols-2 gap-2'>
        <Link to={`/account/admin/statement/personal`}>
          <Card cardDesc='Personal Statement' icon={<FaUser />} />
        </Link>
        <Link to={`/account/admin/statement/group`}>
          <Card cardDesc='Group Statement' icon={<FaPeopleGroup />} />
        </Link>
      </div>
    </section>
  );
};

export default GroupStatementLanding;

export const loader = async () => {
  const resp = await queryClient.ensureQueryData({
    queryKey: ['user'],
    queryFn: () => fetchOnlyData({ url: '/users/me' }),
  });

  const roles = ['super-admin', 'admin'];

  if (resp?.user && !roles.includes(resp?.user?.role)) {
    return redirect('/');
  }
};
