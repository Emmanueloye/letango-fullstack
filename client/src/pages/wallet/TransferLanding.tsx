import Card from '../../components/UI/Card';
import { Link } from 'react-router-dom';
import { FaMoneyBillTransfer } from 'react-icons/fa6';
import { MdOutlineMoveDown } from 'react-icons/md';

const TransferLanding = () => {
  return (
    <div className='grid lg:grid-cols-2 gap-2'>
      <Link to='/account/personal-wallet/transfer/personal'>
        <Card cardDesc='Transfer to wallet' icon={<FaMoneyBillTransfer />} />
      </Link>
      <Card cardDesc='Transfer to group' icon={<MdOutlineMoveDown />} />
    </div>
  );
};

export default TransferLanding;
