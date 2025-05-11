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
        <div className='grid md:grid-cols-3 gap-4'>
          <Link to='/account/personal-wallet/transactions'>
            <Card
              cardDesc='Balance'
              balance={user.personalWallet}
              icon={<MdOutlineAccountBalance />}
              className='curson-pointer'
            />
          </Link>

          <Card
            cardDesc='monthly inflow'
            balance={user.inflow}
            icon={<GiReceiveMoney />}
          />

          <Card
            cardDesc='monthly outflow'
            balance={user.outflow}
            icon={<GiPouringChalice />}
          />
        </div>
        {/* personal wallet btns */}
        <div className='grid md:grid-cols-4 gap-3 mt-4 mb-3'>
          <LinkBtn
            btnText='contribute'
            url={`/account/personal-wallet/contribute/${user.userRef}`}
            className='w-full flex justify-center'
          />
          <LinkBtn
            btnText='transfer'
            url={`/account/personal-wallet/transfer`}
            className='w-full flex justify-center'
          />
          <LinkBtn
            btnText='beneficiaries'
            url={`/account/personal-wallet/beneficiary/${user.userRef}`}
            className='w-full flex justify-center'
          />

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
