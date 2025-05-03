import { MdOutlineAccountBalance } from 'react-icons/md';
import Card from '../../components/UI/Card';
import { GiPouringChalice, GiReceiveMoney } from 'react-icons/gi';
import { Link, useOutletContext } from 'react-router-dom';
import Chart from '../../components/DashboardComponents/Chart';
import { walletData } from '../../assets/tempData/chartData';
import Button from '../../components/UI/Button';
import { User } from '../../dtos/UserDto';
import LinkBtn from '../../components/UI/LinkBtn';

// data type
interface DataType {
  [key: string]: number | string;
}

const PersonalWallet = () => {
  const user = useOutletContext() as User;

  return (
    <>
      <section>
        {/* Wallet cards */}
        <div className='grid grid-cols-3 gap-4'>
          <Link to='/account/personal-wallet/transactions'>
            <Card
              cardDesc='Balance'
              balance={user.personalWallet}
              icon={<MdOutlineAccountBalance />}
            />
          </Link>
          <Link to='/account/personal-wallet/inflows'>
            <Card
              cardDesc='inflow'
              balance={user.inflow}
              icon={<GiReceiveMoney />}
            />
          </Link>
          <Link to='/account/personal-wallet/outflows'>
            <Card
              cardDesc='outflow'
              balance={user.outflow}
              icon={<GiPouringChalice />}
            />
          </Link>
        </div>
        {/* personal wallet btns */}
        <div className='flex gap-3 mt-4 mb-3'>
          <LinkBtn
            btnText='contribute'
            url={`/account/personal-wallet/contribute/${user.userRef}`}
            className='w-full flex justify-center'
          />
          <Button btnText='transfer' btnType='button' />
          <Button btnText='place withdrawal' btnType='button' />
        </div>
        {/* Chart section */}
        <>
          <h3 className='py-4 font-600 uppercase '>Personal wallet Tracker</h3>

          <Chart
            data={walletData as DataType[]}
            xAxisName={'name'}
            dataKeys={['inflow', 'outflow', 'balance']}
            barColors={['#00b6d4', '#00a63e', '#011359']}
          />
        </>
      </section>
    </>
  );
};

export default PersonalWallet;
