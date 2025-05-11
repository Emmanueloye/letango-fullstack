import { formatNumber } from '../../helperFunc.ts/utilsFunc';

const BalanceCard = ({ balance }: { balance: number }) => {
  return (
    <div className='capitalize flex justify-center flex-wrap gap-4 py-4 border-b-2 border-b-green-500 mb-8 font-600 font-poppins'>
      <h3>account balance:</h3>
      <h3>&#8358;{formatNumber(balance)}</h3>
    </div>
  );
};

export default BalanceCard;
